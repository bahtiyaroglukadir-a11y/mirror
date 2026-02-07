// coreEngine.js
// Mirror – Decision Frame Engine v2
// Amaç: Karar alanını varsayım / risk / alternatif ekseninde
// derinlikli ve rahatsız edici (ama yönlendirmeyen) biçimde açmak

function extractAssumptions(text) {
  const assumptions = [];

  if (/yapmalıyım|zorundayım|başka yol yok|mecbur/i.test(text)) {
    assumptions.push(
      "Kararın zorunlu olduğu ve başka seçenek olmadığı varsayılıyor."
    );
  }

  if (/herkes|kesin|daima|asla/i.test(text)) {
    assumptions.push(
      "Durumun mutlak ve değişmez olduğu varsayılıyor."
    );
  }

  if (/geç kaldım|çok geç|son şans/i.test(text)) {
    assumptions.push(
      "Zaman baskısının geri dönüşü olmayan bir noktada olduğu varsayılıyor."
    );
  }

  if (assumptions.length === 0) {
    assumptions.push(
      "Metinde açıkça ifade edilen güçlü bir varsayım bulunmuyor."
    );
  }

  return assumptions;
}

function identifyRisks(text) {
  const risks = [];

  if (/hata|yanlış|pişman/i.test(text)) {
    risks.push(
      "Yanlış bir karar alma ve sonradan pişmanlık duyma riski mevcut."
    );
  }

  if (/acele|hemen|şimdi/i.test(text)) {
    risks.push(
      "Aceleyle verilen karar uzun vadeli sonuçları zayıflatabilir."
    );
  }

  if (/kaybet|fırsat|elinden kaç/i.test(text)) {
    risks.push(
      "Fırsat kaybı korkusu karar üzerinde baskı oluşturuyor olabilir."
    );
  }

  if (risks.length === 0) {
    risks.push(
      "Metinde belirgin bir risk ifadesi tespit edilmedi."
    );
  }

  return risks;
}

function generateAlternatives(text) {
  const alternatives = [];

  alternatives.push(
    "Kararı tamamen vermek yerine küçük ve geri alınabilir bir adım atmak."
  );

  alternatives.push(
    "Mevcut seçenekleri yeniden tanımlayıp eksik olan ihtimalleri aramak."
  );

  if (!/bekle|erte/i.test(text)) {
    alternatives.push(
      "Kararı erteleyerek yeni bilgi ve geri bildirim toplamak."
    );
  }

  return alternatives;
}

function calculateDepth(assumptions, risks, alternatives) {
  let depth = "orta";

  if (assumptions.length >= 3 || risks.length >= 3) {
    depth = "yüksek";
  }

  if (alternatives.length <= 1) {
    depth = "yüzeysel";
  }

  return depth;
}

function buildSummary(depth) {
  if (depth === "yüzeysel") {
    return "Bu soru şu an yüzeysel ele alınıyor. Karar alanı yeterince açılmamış.";
  }

  if (depth === "yüksek") {
    return "Bu karar yüksek varsayım ve risk baskısı altında. Sorunun kendisi yeniden çerçevelenebilir.";
  }

  return "Bu karar bazı varsayımlar ve riskler içeriyor. Netlik artırılabilir.";
}

function buildReadable(depth) {
  if (depth === "yüzeysel") {
    return "Bu noktada karar vermekten önce varsayımları netleştirmek daha sağlıklı olabilir.";
  }

  if (depth === "yüksek") {
    return "Bu karar acele veya baskı altında şekilleniyor olabilir. Sorunun kendisini yeniden ele almak faydalı olabilir.";
  }

  return "Karar, içerdiği varsayımlar ve riskler nedeniyle dikkatli ele alınmalı.";
}

function handleInput({ text, session_id, history }) {
  if (!text || text.trim().length < 3) {
    return {
      type: "silence",
      readable: "Yeterli içerik bulunmadığı için karar çerçevesi oluşturulmadı."
    };
  }

  const assumptions = extractAssumptions(text);
  const risks = identifyRisks(text);
  const alternatives = generateAlternatives(text);

  const depth = calculateDepth(assumptions, risks, alternatives);

  return {
    type: "decision-frame",
    depth: depth,
    summary: buildSummary(depth),
    structured: {
      assumptions,
      risks,
      alternatives
    },
    readable: buildReadable(depth)
  };
}

module.exports = { handleInput };
