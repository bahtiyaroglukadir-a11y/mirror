// coreEngine.js
// Mirror – Stabil Deterministik Karar Motoru
// Backend uyumlu, AI bağımsız

// ----------------------------
// ANALİZ FONKSİYONLARI
// ----------------------------

function extractAssumptions(text) {
  const assumptions = [];
  const reasoning = [];

  if (/zorundayım|mecbur|başka yol yok/i.test(text)) {
    assumptions.push("Başka seçenek olmadığı varsayılıyor.");
    reasoning.push("Zorunluluk dili tespit edildi.");
  }

  if (/herkes|her zaman|asla/i.test(text)) {
    assumptions.push("Durumun genelleştirildiği varsayılıyor.");
    reasoning.push("Genelleme dili tespit edildi.");
  }

  if (/belki|emin değilim|kararsızım/i.test(text)) {
    assumptions.push("Belirsizlik varsayımı mevcut.");
    reasoning.push("Belirsizlik dili tespit edildi.");
  }

  if (assumptions.length === 0) {
    assumptions.push("Belirgin bir varsayım açıkça ifade edilmemiş.");
    reasoning.push("Açık varsayım bulunamadı.");
  }

  return { assumptions, reasoning };
}

function identifyRisks(text) {
  const risks = [];
  const reasoning = [];

  if (/acele|hemen|şimdi/i.test(text)) {
    risks.push("Aceleyle verilen karar uzun vadeli sonuçlar doğurabilir.");
    reasoning.push("Zaman baskısı tespit edildi.");
  }

  if (/pişman|yanlış|zarar/i.test(text)) {
    risks.push("Yanlış karar sonrası pişmanlık riski mevcut.");
    reasoning.push("Pişmanlık riski tespit edildi.");
  }

  if (risks.length === 0) {
    risks.push("Belirgin bir risk açıkça ifade edilmemiş.");
    reasoning.push("Açık risk bulunamadı.");
  }

  return { risks, reasoning };
}

function generateAlternatives() {
  return [
    "Kararı tamamen vermek yerine küçük ve geri alınabilir bir adım atmak.",
    "Mevcut seçenekleri yeniden tanımlayıp eksik olan ihtimalleri aramak.",
    "Kararı erteleyerek yeni bilgi ve geri bildirim toplamak."
  ];
}

// ----------------------------
// KARAR HESAPLAMA
// ----------------------------

function calculatePressure(assumptions, risks) {
  let pressure = 1;
  if (assumptions.length > 1) pressure++;
  if (risks.length > 1) pressure++;
  return Math.min(3, pressure);
}

function determineTone(pressure) {
  if (pressure === 1) return "düşük";
  if (pressure === 2) return "orta";
  return "yüksek";
}

function determineDepth(assumptions, risks, pressure) {
  const score = assumptions.length + risks.length + pressure;
  if (score <= 3) return "düşük";
  if (score <= 6) return "orta";
  return "yüksek";
}

function buildSummary(tone) {
  if (tone === "yüksek") {
    return "Bu karar yüksek baskı altında ve dikkatle ele alınmalı.";
  }
  if (tone === "orta") {
    return "Bu karar bazı varsayımlar ve riskler içeriyor. Netlik artırılabilir.";
  }
  return "Bu karar şu an düşük baskı altında değerlendiriliyor.";
}

function buildReadable(depth) {
  if (depth === "yüksek") {
    return "Karar alanı daralmış görünüyor. Varsayımları yeniden ele almak faydalı olabilir.";
  }
  if (depth === "orta") {
    return "Karar, içerdiği varsayımlar ve riskler nedeniyle dikkatli ele alınmalı.";
  }
  return "Bu karar alanı şu an sakin ve geniş görünüyor.";
}

// ----------------------------
// ANA MOTOR (BACKEND UYUMLU)
// ----------------------------

function handleInput({ text }) {
  if (!text || typeof text !== "string" || text.trim().length < 3) {
    return {
      type: "silence",
      readable: "Yeterli içerik bulunmadığı için değerlendirme yapılmadı."
    };
  }

  const assumptionResult = extractAssumptions(text);
  const riskResult = identifyRisks(text);
  const alternatives = generateAlternatives();

  const pressure = calculatePressure(
    assumptionResult.assumptions,
    riskResult.risks
  );

  const tone = determineTone(pressure);
  const depth = determineDepth(
    assumptionResult.assumptions,
    riskResult.risks,
    pressure
  );

  const reasoning = [
    ...assumptionResult.reasoning,
    ...riskResult.reasoning,
    `Varsayım ve risk yoğunluğuna göre baskı seviyesi ${pressure} olarak belirlendi.`,
    `Bu nedenle ton '${tone}', derinlik '${depth}' olarak ayarlandı.`
  ];

  return {
    type: "decision-frame",
    pressure,
    depth,
    tone,
    summary: buildSummary(tone),
    structured: {
      assumptions: assumptionResult.assumptions,
      risks: riskResult.risks,
      alternatives,
      reasoning
    },
    readable: buildReadable(depth)
  };
}

module.exports = { handleInput };
