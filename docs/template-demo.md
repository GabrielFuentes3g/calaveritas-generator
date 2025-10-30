# Plantilla: Demo Template

**ID:** `demo`

**Descripción:** Plantilla de demostración para testing

**Requiere característica:** Sí

## Patrón

```
Esta es una plantilla de demo para {name}...```

## Ejemplos de Uso

### JavaScript

```javascript
const calaverita = generator.generateWithTemplate(
  'Juan Pérez',
  'doctor',
  'alegre',
  'demo'
);
```

### API REST

```bash
curl -X POST http://localhost:8080/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "profession": "doctor",
    "trait": "alegre",
    "templateId": "demo"
  }'
```

---

_Documentación generada automáticamente el 29/10/2025_
