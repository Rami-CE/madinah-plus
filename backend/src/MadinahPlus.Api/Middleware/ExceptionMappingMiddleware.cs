using System.Net;

namespace MadinahPlus.Api.Middleware;

public class ExceptionMappingMiddleware
{
    private readonly RequestDelegate _next;
    public ExceptionMappingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            await Write(context, HttpStatusCode.Unauthorized, ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            await Write(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (ArgumentException ex)
        {
            await Write(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            await Write(context, HttpStatusCode.Conflict, ex.Message);
        }
    }

    private static Task Write(HttpContext context, HttpStatusCode code, string message)
    {
        context.Response.StatusCode = (int)code;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsJsonAsync(new { error = message });
    }
}
