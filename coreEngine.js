// coreEngine.js

// ----------------------------
// Yardımcı analiz fonksiyonları
// ----------------------------

function extractAssumptions(text) {
  const assumptions = [];

  if (/zorunda|mecbur|başka çare yok/i.test(text)) {
    assumptions.push("Kararın zorunlu olduğu varsayılıyor.");
  }

  if (/hemen|acil|şimdi/i.test(text)) {
    assumptions.push("Zaman baskısı olduğu varsayılıyor.");
  }

  if (assumptions.length === 0) {
    assumptions.push("Metinde açık bir varsayım net biçimde görünmüyor.");
  }

  return assumptions;
}

function identifyRisks(text) {
  const risks = [];

  if (/pişman|zarar|kayıp/i.test(text)) {
    risks.push("Kararın olumsuz sonuçlar doğurma riski var.");
  }

  if (/acele/i.test(text)) {
    risks.push("Aceleyle verilen karar uzun vadede sorun yaratabilir.");
  }

  if (risks.length === 0) {
    risks.push("Belirgin bir risk ifadesi tespit edilmedi.");
  }

  return risks;
}

function generateAlternatives(text) {
  const alternatives = [
    "Kararı tamamen vermek yerine küçük ve geri alınabilir bir adım atmak.",
    "Mevcut seçenekleri yeniden tanımlayıp eksik ihtimalleri aramak."
  ];

  if (/bekle|erte/i.test(text)) {
    alternatives.push("Kararı erteleyerek yeni bilgi ve geri bildirim toplamak.");
  }

  return alternatives;
}

function calculatePressure(assumptions, risks) {
  let pressure = 1;
  if (assumptions.length > 1) pressure++;
  if (risks.length > 1) pressure++;
  return Math.min(3, pressure);
}

function determineTone(pressure) {
  if (pressure >= 3) return "yüksek";
  if (pressure === 2) return "orta";
  return "düşük";
}

function buildSummary(tone) {
  if (tone === "yüksek") {
    return "Bu karar yüksek baskı altında ve dikkatle ele alınmalı.";
  }
  if (tone === "orta") {
    return "Bu karar bazı varsayımlar ve riskler içeriyor. Netlik artırılabilir.";
  }
  return "Bu karar alanı şu an sakin ve geniş görünüyor.";
}

function buildReadable(summary) {
  return summary;
}

// ----------------------------
// ANA KARAR MOTORU
// ----------------------------

function handleInput({ text }) {
  if (!text || text.trim().length < 3) {
    return {
      type: "silence",
      readable: "Yeterli içerik bulunmadığı için değerlendirme yapılmadı."
    };
  }

  const assumptions = extractAssumptions(text);
  const risks = identifyRisks(text);
  const alternatives = generateAlternatives(text);

  const pressure = calculatePressure(assumptions, risks);
  const tone = determineTone(pressure);

  const summary = buildSummary(tone);

  return {
    type: "decision-frame",
    pressure,
    tone,
    summary,
    structured: {
      assumptions,
      risks,
      alternatives
    },
    readable: buildReadable(summary)
  };
}

// ----------------------------
// EXPORT
// ----------------------------

module.exports = { handleInput };
