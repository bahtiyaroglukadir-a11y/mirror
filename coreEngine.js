// coreEngine.js
// Mirror – Decision Frame Engine v3
// Odak: Baskı analizi + karar dili ayarı (karar VERMEZ)

function extractAssumptions(text) {
  const assumptions = [];

  if (/zorundayım|mecbur|başka yol yok/i.test(text)) {
    assumptions.push({ type: "baskı", weight: 5, note: "Zorunluluk varsayımı" });
  }

  if (/asla|daima|kesin/i.test(text)) {
    assumptions.push({ type: "mutlak", weight: 3, note: "Mutlaklık varsayımı" });
  }

  if (/geç kaldım|son şans/i.test(text)) {
    assumptions.push({ type: "zaman", weight: 4, note: "Zaman baskısı varsayımı" });
  }

  if (assumptions.length === 0) {
    assumptions.push({ type: "zayıf", weight: 1, note: "Belirgin varsayım yok" });
  }

  return assumptions;
}

function identifyRisks(text) {
  const risks = [];

  if (/pişman|yanlış/i.test(text)) {
    risks.push({ type: "duygusal", weight: 4, note: "Pişmanlık riski" });
  }

  if (/acele|hemen/i.test(text)) {
    risks.push({ type: "zaman", weight: 3, note: "Acele kararı riski" });
  }

  if (/kaybet|fırsat/i.test(text)) {
    risks.push({ type: "kayıp", weight: 2, note: "Fırsat kaybı riski" });
  }

  if (risks.length === 0) {
    risks.push({ type: "düşük", weight: 1, note: "Belirgin risk yok" });
  }

  return risks;
}

function generateAlternatives(text) {
  const alternatives = [];

  alternatives.push("Küçük ve geri alınabilir bir adım atmak");
  alternatives.push("Kararı zamana yayarak yeni bilgi toplamak");

  return alternatives;
}

function calculatePressure(assumptions, risks) {
  const assumptionScore = assumptions.reduce((a, b) => a + b.weight, 0);
  const riskScore = risks.reduce((a, b) => a + b.weight, 0);

  return assumptionScore + riskScore;
}

function determineTone(pressure) {
  if (pressure >= 10) return "yüksek";
  if (pressure >= 6) return "orta";
  return "düşük";
}

function buildSummary(tone) {
  if (tone === "yüksek") {
    return "Bu düşünce yüksek baskı altında şekilleniyor. Sorunun kendisi yeniden ele alınabilir.";
  }
  if (tone === "orta") {
    return "Bu karar bazı varsayımlar ve riskler içeriyor. Netlik artırılabilir.";
  }
  return "Bu soru şu an düşük baskı altında değerlendiriliyor.";
}

function buildReadable(tone) {
  if (tone === "yüksek") {
    return "Bu noktada verilen karar acele veya zorunluluk hissiyle şekilleniyor olabilir. Karardan önce varsayımları sorgulamak faydalı olabilir.";
  }
  if (tone === "orta") {
    return "Karar, içerdiği varsayımlar ve riskler nedeniyle dikkatli ele alınmalı.";
  }
  return "Bu karar alanı şu an sakin ve geniş görünüyor.";
}

function handleInput({ text }) {
  const assumptions = extractAssumptions(text);
  const risks = identifyRisks(text);
  const alternatives = generateAlternatives(text);

  const pressure = calculatePressure(assumptions, risks);
  const tone = determineTone(pressure);

  return {
    type: "decision-frame",
    pressure,
    tone,
    summary: buildSummary(tone),
    structured: {
      assumptions,
      risks,
      alternatives
    },
    readable: buildReadable(tone)
  };
}

module.exports = { handleInput };
