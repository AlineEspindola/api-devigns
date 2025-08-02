# Documentação da API - Rotas

## 1. Rotas de Capítulos (`chapter`)

### Base URL
`/chapter`

### Endpoints

| Método | Rota                        | Descrição                                 | Autenticação | Parâmetros URL                 |
|--------|-----------------------------|-------------------------------------------|--------------|-------------------------------|
| PUT    | `/:chapterID/:turnID/turn`  | Adiciona um turno a um capítulo específico | Sim          | `chapterID` (ID do capítulo)<br>`turnID` (ID do turno) |
| GET    | `/:turnID`                  | Obtém o capítulo pelo ID do turno          | Não          | `turnID` (ID do turno)          |

### Detalhes

#### PUT `/chapter/:chapterID/:turnID/turn`
- **Descrição:** Adiciona um turno ao capítulo identificado por `chapterID`.
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
  - `200 OK` - Sucesso.
  - `403 Forbidden` - Token não informado ou inválido.

#### GET `/chapter/:turnID`
- **Descrição:** Busca capítulo relacionado ao turno `turnID`.
- **Resposta:**
  - `200 OK` com dados do capítulo.
  - `404 Not Found` se não encontrado.

---

## 2. Rotas de Opções (`options`)

### Base URL
`/options`

### Endpoints

| Método | Rota          | Descrição                          | Autenticação | Parâmetros URL       |
|--------|---------------|----------------------------------|--------------|---------------------|
| GET    | `/:chapterID` | Obtém opções de um capítulo       | Não          | `chapterID` (ID do capítulo) |

### Detalhes

#### GET `/options/:chapterID`
- **Descrição:** Retorna opções relacionadas ao capítulo.
- **Resposta:**
  - `200 OK` com lista de opções.
  - `404 Not Found` caso capítulo não exista ou sem opções.

---

## 3. Rotas de Turnos (`turn`)

### Base URL
`/turn`

### Endpoints

| Método | Rota                          | Descrição                          | Autenticação | Parâmetros URL         |
|--------|-------------------------------|----------------------------------|--------------|-----------------------|
| GET    | `/:turnID`                    | Obtém detalhes de um turno       | Não          | `turnID` (ID do turno) |
| POST   | `/init_turn`                  | Cria um novo turno               | Não          | -                     |
| POST   | `/finish_turn`                | Finaliza turno                   | Sim          | -                     |
| GET    | `/choose_option/:turnID/:choice` | Escolhe opção para turno       | Sim          | `turnID`, `choice`     |

### Detalhes

#### GET `/turn/:turnID`
- **Descrição:** Retorna dados do turno.
- **Resposta:**
  - `200 OK` com dados.
  - `404 Not Found` se não encontrado.

#### POST `/turn/init_turn`
- **Descrição:** Cria um novo turno.
- **Body:** Dados do turno (JSON).
- **Resposta:**
  - `201 Created` com dados do turno.
  - `400 Bad Request` para dados inválidos.

#### POST `/turn/finish_turn`
- **Descrição:** Finaliza um turno existente.
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
  - `200 OK` ao finalizar.
  - `403 Forbidden` se token inválido ou ausente.

#### GET `/turn/choose_option/:turnID/:choice`
- **Descrição:** Registra escolha para turno.
- **Headers:** `Authorization: Bearer <token>`
- **Parâmetros:**  
  - `turnID`: ID do turno  
  - `choice`: opção escolhida  
- **Resposta:**  
  - `200 OK` sucesso.  
  - `403 Forbidden` token inválido/ausente.  
  - `404 Not Found` turno ou opção não encontrados.

---

## Autenticação

- Rotas protegidas exigem token JWT no header `Authorization`:
- Caso o token não seja enviado ou inválido, a API responde com status HTTP `403 Forbidden`.

---

