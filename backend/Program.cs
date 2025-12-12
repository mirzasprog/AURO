using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.Entities;
using backend.Services.Ai;
using backend.Services.Chat;
using backend.Services.Chatbot;
using backend.Services.Knowledge;
using backend.Services.KnowledgeBase;
using backend.Services.OpenAi;
using backend.Services.VectorStore;
using backend.Services;
using backend.Models;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddEventLog(eventLogSettings =>
{
    eventLogSettings.SourceName = "AuroApp";
    eventLogSettings.LogName = "AuroLog";
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.

builder.Services.AddDbContext<Auro2Context>(
    options => options.UseSqlServer(connectionString, op =>
        op.CommandTimeout(180)));


builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IRedovniOtpisRepository, RedovniOtpisRepository>();
builder.Services.AddScoped<IVanredniOtpisRepository, VanredniOtpisRepository>();
builder.Services.AddScoped<IIzvjestajRepository, IzvjestajRepository>();
builder.Services.AddScoped<IIzdatnicaRepository, IzdatnicaRepository>();
builder.Services.AddScoped<IPDTlistaRepository, PDTlistaRepository>();
builder.Services.AddScoped<INeuslovnaRobaRepository, NeuslovnaRobaRepository>();
builder.Services.AddScoped<IKontrolneInventureRepository, KontrolneInventureRepository>();
builder.Services.AddScoped<IUcesniciInventureRepository, UcesniciInventureRepository>();
builder.Services.AddScoped<IUploadRepository, UploadRepository>();
builder.Services.AddScoped<IParcijalnaInventuraRepository, ParcijalnaInventuraRepository>();
builder.Services.AddScoped<IAkcijeRepository, AkcijeRepository>();
builder.Services.AddScoped<IDailyTaskRepository, DailyTaskRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IPrometiRepository, PrometiRepository>();
builder.Services.AddScoped<IVikendAkcijeRepository, VikendAkcijeRepository>();
builder.Services.AddScoped<IServiceInvoiceRepository, ServiceInvoiceRepository>();

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<AiOptions>(builder.Configuration.GetSection(AiOptions.SectionName));
builder.Services.AddHttpClient<ILlmClient, HttpLlmClient>();
builder.Services.AddHttpClient<IEmbeddingClient, HttpEmbeddingClient>();
builder.Services.Configure<VectorStoreOptions>(builder.Configuration.GetSection(VectorStoreOptions.SectionName));
builder.Services.AddSingleton<IVectorStore, PgVectorStore>();
builder.Services.Configure<DocumentImportOptions>(builder.Configuration.GetSection(DocumentImportOptions.SectionName));
builder.Services.AddSingleton<ITextExtractor, PdfTextExtractor>();
builder.Services.AddSingleton<ITextExtractor, ExcelTextExtractor>();
builder.Services.AddSingleton<ITextExtractor, ImageTextExtractor>();
builder.Services.AddScoped<DocumentImportService>();
builder.Services.AddScoped<RagChatService>();
builder.Services.AddScoped<LocalChatbotService>();
builder.Services.Configure<OpenAiOptions>(builder.Configuration.GetSection(OpenAiOptions.SectionName));
builder.Services.AddHttpClient<OpenAiChatService>();
builder.Services.AddHttpClient<OpenAiEmbeddingService>();
builder.Services.AddScoped<KnowledgeBaseService>();
builder.Services.Configure<CompanyInfoOptions>(builder.Configuration.GetSection(CompanyInfoOptions.SectionName));
builder.Services.AddSingleton<ICompanyInfoProvider, CompanyInfoProvider>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        RequireExpirationTime = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers();
builder.Services.AddSpaStaticFiles(configuration =>
    {
        configuration.RootPath = "auro/dist";
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Auro WEB API",
        Description = " Web API za regulisanje stanja robe u prodavnicama, provođenja otpisa, kontrolnih inventura, izdatnica troška i neuslovne robe.",
    });
});

if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddHttpsRedirection(options =>
    {
        options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
        options.HttpsPort = 443;
    });
}

var app = builder.Build();

await DatabaseInitializer.EnsureDailyTaskTablesAsync(app.Services);
await DatabaseInitializer.EnsureVipTablesAsync(app.Services);
await DatabaseInitializer.EnsureServiceInvoiceTablesAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    // options.RoutePrefix = string.Empty;
});
}

app.UseStaticFiles();
// app.UseHttpsRedirection();

if (!app.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles(new StaticFileOptions()
    {
        OnPrepareResponse = ctx =>
        {
            var headers = ctx.Context.Response.GetTypedHeaders();
            headers.CacheControl = new CacheControlHeaderValue
            {
                //Public = true,
                //MaxAge = TimeSpan.FromDays(0)
                NoCache = true,
                NoStore = true,
                MustRevalidate = true,
                MaxAge = TimeSpan.Zero
            };

        }
    });
}

app.UseExceptionHandler(a => a.Run(async context =>
{
    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
    var exception = exceptionHandlerPathFeature?.Error;
    var result = JsonSerializer.Serialize(new { poruka = exception?.Message, source = exception?.Source });
    context.Response.ContentType = "application/json";
    await context.Response.WriteAsync(result);
}));

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllOrigins");

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
});

app.UseSpa(spa =>
{
    // To learn more about options for serving an Angular SPA from ASP.NET Core,
    // see https://go.microsoft.com/fwlink/?linkid=864501

    spa.Options.SourcePath = "auro";

    spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions()
    {
        OnPrepareResponse = ctx =>
        {
            var headers = ctx.Context.Response.GetTypedHeaders();

            headers.CacheControl = new CacheControlHeaderValue
            {
                //Public = true,
                //MaxAge = TimeSpan.FromDays(0)
                NoCache = true,
                NoStore = true,
                MustRevalidate = true,
                MaxAge = TimeSpan.Zero
            };

        }
    };


    if (app.Environment.IsDevelopment())
    {
        // spa.UseAngularCliServer(npmScript: "start");
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
});


app.MapControllers();
app.Run();
