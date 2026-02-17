using System;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;
        
        var memberId = resultContext.HttpContext.User.GetMemberId();

        var dbContext = resultContext.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        await dbContext.Members.Where(m => m.Id == memberId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.LastActive, DateTime.UtcNow));
    }
}
