# Konzum360 Chatbot (OpenAI + RAG)

## Konfiguracija OpenAI
- Popuniti sekciju `OpenAI` u `appsettings.json` ili postaviti `OpenAI__ApiKey` kao environment varijablu.
- Parametri: `BaseUrl`, `ApiKey`, `Model` (npr. `gpt-4.1-mini`), `EmbeddingModel` (npr. `text-embedding-3-small`).

## Migracije
- Nova tabela za znanje: `KnowledgeDocumentsRag` (Id, Title, Content, Embedding, CreatedAt).
- Nova tabela za lokalni chatbot: `KnowledgeTopics` + `UnansweredQuestions` sa inicijalnim podacima za inventuru i otpise.
- Pokrenuti migraciju: `dotnet ef database update` (ili primijeniti SQL iz migracija `20240608_AddKnowledgeDocumentsRag`, `20241005_AddLocalChatbot` i `20241029_AddKnowledgeTopicsIfMissing`).

## Dodavanje dokumenta
`POST /api/knowledge-docs`
```json
{
  "title": "Procedura kase",
  "content": "Tekstualni sadržaj dokumenta koji opisuje korake..."
}
```

## Chat upit
`POST /api/chatbot`
```json
{
  "message": "Kako resetovati kasu?"
}
```

## Napomene
- Endpointi zahtijevaju autentifikaciju (JWT) kao i ostatak API-ja.
- Ako nema relevantnog konteksta u bazi, model će jasno naglasiti da nema podatke i neće izmišljati odgovore.
