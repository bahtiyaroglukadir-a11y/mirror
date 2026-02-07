// coreEngine.js
// Mirror – Decision Frame Engine v4
// Odak: Baskı + Çelişki + Kaçış + Yanlış Soru Tespiti
// Karar vermez. Karar alanını zorlar.

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

  if (/belki|emin değilim|kararsızım/i.test(text)) {
    assumptions.push({ type: "belirsizlik", weight: 2, note: "Belirsizlik varsayımı" });
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
    risks.push({ type: "zaman", weight: 3, note: "Acele karar riski" });
  }

  if (/kaybet|fırsat/i.test(text)) {
    risks.push({ type: "kayıp", weight: 2, note: "Fırsat kaybı riski" });
  }

  if (risks.length === 0) {
    risks.push({ type: "düşük", weight: 1, note: "Belirgin risk yok" });
  }

  return risks;
}

function generateAlternatives() {
  return [
    "Kararı tamamen vermek yerine küçük ve geri alınabilir bir adım atmak",
    "Kararı zamana yayarak yeni bilgi toplamak"
  ];
}

function calculatePressure(assumptions, risks) {
  const a = assumptions.reduce((s, x) => s + x.weight, 0);
  const r = risks.reduce((s, x) => s + x.weight, 0);
  return a + r;
}

// 🔴 ÇELİŞKİ TESPİTİ
function detectContradiction(assumptions) {
  const hasPressure = assumptions.some(a => a.type === "baskı");
  const hasUncertainty = assumptions.some(a => a.type === "belirsizlik");

  if (hasPressure && hasUncertainty) {
    return "Aynı anda hem zorunluluk hem belirsizlik varsayımı mevcut.";
  }
  return null;
}

// 🔴 KAÇIŞ TESPİTİ
function detectAvoidance(text, pressure) {
  if (pressure < 4 && /bilmiyorum|fark etmez|herhalde/i.test(text)) {
    return "Soru karar almaktan çok kaçınma veya erteleme eğilimi gösteriyor.";
  }
  return null;
}

// 🔴 YANLIŞ SORU TESPİTİ
function detectWrongQuestion(assumptions, risks) {
  if (assumptions.length === 1 && risks.length === 1) {
    return "Bu soru bir karar sorusu değil, duygusal netlik arayışı olabilir.";
  }
  return null;
}

function determineTone(pressure, contradiction, avoidance, wrongQuestion) {
  if (wrongQuestion) return "yanlış-soru";
  if (contradiction) return "çelişkili";
  if (avoidance) return "kaçış";
  if (pressure >= 10) return "yüksek";
  if (pressure >= 6) return "orta";
  return "düşük";
}

function buildSummary(tone) {
  if (tone === "yanlış-soru") {
    return "Bu soru bir karar üretmekten çok bir duygu durumunu ifade ediyor olabilir.";
  }
  if (tone === "çelişkili") {
    return "Bu düşünce kendi içinde çelişen varsayımlar içeriyor.";
  }
  if (tone === "kaçış") {
    return "Bu soru karar almaktan kaçınma eğilimi gösteriyor olabilir.";
  }
  if (tone === "yüksek") {
    return "Bu düşünce yüksek baskı altında şekilleniyor.";
  }
  if (tone === "orta") {
    return "Bu karar bazı varsayımlar ve riskler içeriyor.";
  }
  return "Bu soru düşük baskı altında değerlendiriliyor.";
}

function buildReadable(tone) {
  if (tone === "yanlış-soru") {
    return "Burada karar vermekten önce ne hissettiğini ayırt etmek daha anlamlı olabilir.";
  }
  if (tone === "çelişkili") {
    return "Zorunluluk hissi ile belirsizlik aynı anda var. Bu ikisi birlikte doğru olamaz.";
  }
  if (tone === "kaçış") {
    return "Bu soru karar almaktan çok kararı erteleme ihtiyacını yansıtıyor olabilir.";
  }
  if (tone === "yüksek") {
    return "Bu karar acele veya baskı altında şekilleniyor olabilir. Sorunun kendisini yeniden ele almak faydalı olabilir.";
  }
  if (tone === "orta") {
    return "Karar, içerdiği varsayımlar ve riskler nedeniyle dikkatli ele alınmalı.";
  }
  return "Bu karar alanı şu an sakin ve geniş görünüyor.";
}


module.exports = { handleInput };
