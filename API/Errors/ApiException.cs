using System;

namespace API.Errors;

public class ApiException(int statusCode, string? message, string? details)
{
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = message ?? string.Empty;
    public string Details { get; set; } = details ?? string.Empty;
}
