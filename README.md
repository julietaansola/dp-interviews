# DP Interviews

Banco de preguntas de entrevistas tecnicas para equipos de datos (Data Platform y Data Engineering), con respuestas esperadas, puntos clave y notas para el entrevistador.

Web app estatica hosteada en GitHub Pages: https://julietaansola.github.io/dp-interviews/

## Perfiles cubiertos

- **Data Platform / Infrastructure**: AWS, EKS, Terraform, Karpenter, Kubernetes, Networking, IaC, CI/CD
- **Data Engineer / Software**: Spark, dbt, Python, Airflow, SQL, Data Modeling, Git

Cada perfil tiene preguntas para 3 niveles: **Jr**, **Semi Sr** y **Sr**.

## Correr localmente

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173/dp-interviews/` en el navegador.

## Agregar una pregunta

Las preguntas estan en archivos JSON dentro de `public/data/`:

- `data-platform.json` — preguntas de Data Platform / Infrastructure
- `data-engineer.json` — preguntas de Data Engineer / Software

### Paso a paso

1. Abri el archivo JSON del perfil correspondiente (ej: `public/data/data-engineer.json`)
2. Agrega un nuevo objeto al array `questions` siguiendo este formato:

```json
{
  "id": "de-dbt-ssr-021",
  "profile": "data-engineer",
  "level": "ssr",
  "technology": ["dbt", "SQL"],
  "category": "Data Transformation",
  "difficulty": "medium",
  "question": "Explica la diferencia entre materializar un modelo de dbt como view vs table vs incremental. Cuando usarias cada una?",
  "expected_answer": "Una view se recrea como consulta SQL en cada ejecucion, ideal para modelos livianos que no necesitan persistencia. Una table recrea toda la tabla en cada ejecucion, util para modelos pesados que se consultan frecuentemente. Incremental solo procesa filas nuevas o modificadas, reduciendo tiempo y costo en tablas grandes. Se elige incremental cuando la tabla fuente crece continuamente y no es practico reprocesarla completa.",
  "key_points": [
    "view: no persiste datos, se ejecuta como query",
    "table: recrea completa en cada run",
    "incremental: solo procesa datos nuevos, necesita unique_key e is_incremental()",
    "Considerar costo vs frescura de datos"
  ],
  "interviewer_notes": "Red flag si no menciona incremental. Follow-up: preguntar como manejar late-arriving data en incremental models.",
  "source": "Original — basada en experiencia real (dbt + S3 data lake)",
  "tags": ["materialization", "performance", "dbt-core"]
}
```

3. Crea un PR con el cambio
4. El CI valida automaticamente que el JSON cumple el schema
5. Al mergear, la web se actualiza automaticamente

### Convenciones de ID

Formato: `{perfil}-{tecnologia}-{nivel}-{numero}`

| Campo | Valores |
|-------|---------|
| Perfil | `dp` (Data Platform), `de` (Data Engineer) |
| Tecnologia | `aws`, `eks`, `terraform`, `spark`, `dbt`, `python`, `sql`, `airflow`, etc. |
| Nivel | `jr`, `ssr`, `sr` |
| Numero | 3 digitos, secuencial (ej: `001`, `002`) |

Ejemplos: `dp-terraform-sr-005`, `de-spark-jr-012`

### Validar antes de commitear

```bash
npm run validate
```

Esto verifica que todos los JSONs cumplan el schema (IDs unicos, campos requeridos, enums validos).

## Schema de una pregunta

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `id` | string | si | ID unico con formato `{perfil}-{tech}-{nivel}-{nnn}` |
| `profile` | string | si | `data-platform` o `data-engineer` |
| `level` | string | si | `jr`, `ssr`, o `sr` |
| `technology` | string[] | si | Tecnologias que cubre (min 1) |
| `category` | string | si | Categoria tematica |
| `difficulty` | string | si | `easy`, `medium`, o `hard` |
| `question` | string | si | La pregunta (min 10 caracteres) |
| `expected_answer` | string | si | Respuesta esperada detallada (min 20 caracteres) |
| `key_points` | string[] | si | Puntos clave que el candidato deberia mencionar (min 1) |
| `interviewer_notes` | string | no | Tips, red flags, variantes para el entrevistador |
| `difficulty_justification` | string | no | Por que tiene esa dificultad |
| `source` | string | si | De donde se tomo/adapto la pregunta |
| `tags` | string[] | no | Tags para busqueda y filtrado |

## Stack

- React 19 + Vite + Tailwind CSS
- Datos en JSON estatico (sin backend)
- GitHub Actions para deploy automatico a GitHub Pages
- localStorage para favoritos y preguntas usadas

## Setup de GitHub Pages

Para que el deploy funcione, habilitar GitHub Pages en el repo:

1. Ir a Settings > Pages
2. Source: GitHub Actions
3. El workflow se encarga del resto

