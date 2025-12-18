### Commit 1.1 : Server Side code Setup

1. cd server
npm init -y : to get package.json
2. create all dependencies and node_modules 
npm install express cors dotenv mongoose zod @google/generative-ai @anthropic-ai/sdk axios multer sharp bull redis uuid
3. typescript setup :
npm install --save-dev typescript @types/express @types/node @types/multer tsx eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
4. create typescript configuration at -> tsconfig.json 
look at file contents for reference 
5. create .env.local

PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-quotation
GEMINI_API_KEY=your_gemini_key_here
CLAUDE_API_KEY=your_claude_key_here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

6. create some folders with bash : 
```bash
# Create these folders
mkdir -p src/models
mkdir -p src/services
mkdir -p src/routes
mkdir uploads
```

7. create gitignore

cat > .gitignore << 'EOF'
Dependencies:
node_modules/
package-lock.json
yarn.lock

Environment variables:
.env
.env.local
.env.*.local

IDE:
.vscode/
.idea/
*.swp

OS:
.DS_Store
Thumbs.db

Logs:
logs/
*.log
npm-debug.log*

Build outputs:
dist/
build/

EOF

8. git actions to push the code. 


### Commit 1.2 : Model Codes.

created total 5 models for the backend 
Drawing Schema - stores uploaded engineering drawings
Quote Schema - stores generated quotations
Historical Quote Schema - for client-specific learning (Phase 2)
Review Feedback Schema - for AI learning
Market Data Schema - stores commodity prices for adjustments


### Commit 1.3 : First AI Service : Gemini Service

Check service - src/services/gemini.service.ts

 * The service has 3 private class and 2 async methods
 * initializeGenAI - start the service
 * analyzeDrawing - analyze engineering drawing and extract specifications
 * validateSpecs - validate and normalize extracted specifications
 * getMimeType - determine MIME type from file extension -> what type of image
 * analyzeDrawingsBatch - batch analyze multiple drawings

### Commit 1.4 : First AI Service : Claude Service

Check service - src/services/claude.service.ts

* The service has 2 interfaces, 3 data objects (material costs, labor rates, complexity multipliers), and 5 async methods
* initializeClient - start the service (lazy loading)
* calculateCost - compute manufacturing cost breakdown (material + labor + 30% overhead) using hardcoded market rates
* generateCostAnalysis - send cost breakdown to Claude API to generate professional cost justification
* validateSpecs - use Claude to validate and correct extracted drawing specifications
* calculateCostsBatch - batch process multiple cost calculations

Note: Phase 1 uses hardcoded generic pricing. For production with Inada, we will replace with actual client pricing data.

* Practical Example: End-to-End Flow

Input: FAX image of aluminum bracket (100mm × 50mm × 30mm)

* Step 1 - Gemini analyzes drawing:**
```
{
  material: "aluminum",
  materialQuantity: 5,
  materialUnit: "kg",
  dimensions: { length: 100, width: 50, height: 30, unit: "mm" },
  manufacturingProcess: ["CNC"],
  complexity: 6,
  specialRequirements: ["±0.1mm tolerance"],
  confidence: 92
}
```

* Step 2 - Claude calculates cost:**
- Material: 5 kg × $3.5/kg = $17.50
- Labor: complexity 6 = 2.0 hours × $50/hr (CNC) = $100.00
- Overhead: (17.50 + 100) × 30% = $35.25
- Total: $152.75**

* Step 3 - Claude generates analysis:**
> "This estimate is reasonable because aluminum is priced at $3.5/kg (standard market rate), and a complexity 6 part requires approximately 2 hours of CNC machining at $50/hour, which reflects typical shop labor costs. The 30% overhead covers facility, equipment, and operational expenses."

* Output quotation generated: $152.75 with professional justification