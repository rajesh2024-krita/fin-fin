
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Fintcs.Api.Controllers
{
    [ApiController]
    [Authorize]
    public class BaseController : ControllerBase
    {
        protected string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        protected string GetCurrentUserRole()
        {
            return User.FindFirst("role")?.Value ?? string.Empty;
        }

        protected string? GetCurrentUserSocietyId()
        {
            return User.FindFirst("societyId")?.Value;
        }

        protected bool IsSuperAdmin()
        {
            return GetCurrentUserRole() == "SuperAdmin";
        }

        protected bool IsSocietyAdmin()
        {
            return GetCurrentUserRole() == "SocietyAdmin";
        }

        protected bool HasAccess(params string[] roles)
        {
            var userRole = GetCurrentUserRole();
            return roles.Contains(userRole);
        }
    }
}
