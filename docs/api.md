# API Documentation

Documentación automática generada el 29/10/2025

## Endpoints Disponibles

### POST /api/generate

**Descripción:** Rutas API

**Ejemplo de Request:**
```json
{
  "name": "Juan Pérez",
  "profession": "doctor",
  "trait": "alegre",
  "templateId": "clasica"
}
```

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": {
    "id": "1635789123456",
    "name": "Juan Pérez",
    "profession": "doctor",
    "trait": "alegre",
    "templateId": "clasica",
    "templateName": "Clásica",
    "text": "Aquí yace Juan Pérez, doctor querido...",
    "date": "01/11/2024",
    "metadata": {
      "wordCount": 25,
      "generationTime": 15,
      "userAgent": "browser"
    }
  }
}
```

---

### GET /api/templates

**Descripción:** Endpoint sin descripción

---

### GET /api/history

**Descripción:** Endpoint sin descripción

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1635789123456",
      "name": "Juan Pérez",
      "text": "Aquí yace Juan Pérez...",
      "date": "01/11/2024"
    }
  ]
}
```

---

### GET /api/history/search

**Descripción:** Endpoint sin descripción

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1635789123456",
      "name": "Juan Pérez",
      "text": "Aquí yace Juan Pérez...",
      "date": "01/11/2024"
    }
  ]
}
```

---

### DELETE /api/history

**Descripción:** Endpoint sin descripción

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1635789123456",
      "name": "Juan Pérez",
      "text": "Aquí yace Juan Pérez...",
      "date": "01/11/2024"
    }
  ]
}
```

---

### GET /api/stats

**Descripción:** Endpoint sin descripción

---

### GET /api/validation/rules

**Descripción:** Endpoint sin descripción

---

### POST /api/validation/field

**Descripción:** Endpoint sin descripción

---

### POST /api/validation/contextual

**Descripción:** Endpoint sin descripción

---

### POST /api/export

**Descripción:** Endpoint sin descripción

---

### GET /api/mcp/status

**Descripción:** MCP Integration Endpoints

---

### POST /api/mcp/validate-template

**Descripción:** Endpoint sin descripción

---

### POST /api/mcp/generate-template

**Descripción:** Endpoint sin descripción

**Ejemplo de Request:**
```json
{
  "name": "Juan Pérez",
  "profession": "doctor",
  "trait": "alegre",
  "templateId": "clasica"
}
```

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": {
    "id": "1635789123456",
    "name": "Juan Pérez",
    "profession": "doctor",
    "trait": "alegre",
    "templateId": "clasica",
    "templateName": "Clásica",
    "text": "Aquí yace Juan Pérez, doctor querido...",
    "date": "01/11/2024",
    "metadata": {
      "wordCount": 25,
      "generationTime": 15,
      "userAgent": "browser"
    }
  }
}
```

---

### POST /api/mcp/generate-enhanced

**Descripción:** Endpoint sin descripción

**Ejemplo de Request:**
```json
{
  "name": "Juan Pérez",
  "profession": "doctor",
  "trait": "alegre",
  "templateId": "clasica"
}
```

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": {
    "id": "1635789123456",
    "name": "Juan Pérez",
    "profession": "doctor",
    "trait": "alegre",
    "templateId": "clasica",
    "templateName": "Clásica",
    "text": "Aquí yace Juan Pérez, doctor querido...",
    "date": "01/11/2024",
    "metadata": {
      "wordCount": 25,
      "generationTime": 15,
      "userAgent": "browser"
    }
  }
}
```

---

### GET /

**Descripción:** Servir la aplicación web

---

