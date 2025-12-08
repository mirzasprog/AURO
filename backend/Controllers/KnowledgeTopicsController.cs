using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/knowledge-topics")]
    [Authorize]
    public class KnowledgeTopicsController : ControllerBase
    {
        private readonly Auro2Context _dbContext;

        public KnowledgeTopicsController(Auro2Context dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<KnowledgeTopic>>> GetAllAsync(CancellationToken ct)
        {
            var topics = await _dbContext.KnowledgeTopics.AsNoTracking().OrderBy(t => t.Tema).ToListAsync(ct);
            return Ok(topics);
        }

        [HttpPost]
        public async Task<ActionResult<KnowledgeTopic>> CreateAsync([FromBody] KnowledgeTopic topic, CancellationToken ct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _dbContext.KnowledgeTopics.AddAsync(topic, ct);
            await _dbContext.SaveChangesAsync(ct);

            return CreatedAtAction(nameof(GetAllAsync), new { id = topic.Id }, topic);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateAsync(int id, [FromBody] KnowledgeTopic updated, CancellationToken ct)
        {
            if (id != updated.Id)
            {
                return BadRequest("Id u ruti i tijelu zahtjeva se ne poklapaju.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _dbContext.Entry(updated).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync(ct);

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteAsync(int id, CancellationToken ct)
        {
            var existing = await _dbContext.KnowledgeTopics.FindAsync(new object[] { id }, ct);
            if (existing == null)
            {
                return NotFound();
            }

            _dbContext.KnowledgeTopics.Remove(existing);
            await _dbContext.SaveChangesAsync(ct);

            return NoContent();
        }
    }
}
