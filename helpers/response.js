// Ortak kullanılan cevap fonksiyonları

function successResponse(res, data, meta, message = "İşlem başarılı!") {
  res.status(200).json({
    success: true,
    statusCode: 200,
    timestamp: new Date().toISOString(),
    message,
    data,
    meta,
  });
}

function errorResponse(res, error) {
  if (error.response) {
    const { status, statusText } = error.response;
    return res.status(status).json({
      statusCode: status,
      message: statusText,
    });
  } else if (error.request) {
    return res.status(500).json({
      statusCode: 500,
      message: "Sunucu yanıtı alınamadı. Lütfen tekrar deneyin.",
    });
  } else {
    return res.status(500).json({
      statusCode: 500,
      message: "Sunucu üzerinde bilinmeyen bir hata oluştu.",
    });
  }
}

export {
    successResponse,
    errorResponse
}