using System.Security.Claims;
using MadinahPlus.Api.Services;
using MadinahPlus.Domain.Contracts;
using MadinahPlus.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MadinahPlus.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    public AuthController(AuthService auth) => _auth = auth;

    [AllowAnonymous]
    [HttpPost("login")]
    public Task<LoginResponse> Login([FromBody] LoginRequest body) => _auth.LoginAsync(body);

    [Authorize]
    [HttpGet("me")]
    public Task<AuthUserDto> Me()
    {
        var idValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Invalid token.");
        if (!int.TryParse(idValue, out var id))
            throw new UnauthorizedAccessException("Invalid token.");
        return _auth.GetCurrentAsync(id);
    }
}

[Authorize]
[ApiController]
[Route("api/city")]
public class CityController : ControllerBase
{
    private readonly CityDashboardService _city;
    public CityController(CityDashboardService city) => _city = city;

    [HttpGet]
    public Task<CityDto> Get() => _city.GetCityAsync();

    [HttpGet("priorities")]
    public Task<IReadOnlyList<PriorityDto>> Priorities() => _city.GetPrioritiesAsync();

    [HttpGet("monitoring")]
    public Task<MonitoringDto> Monitoring() => _city.GetMonitoringAsync();

    [Authorize(Roles = "Municipality")]
    [HttpGet("accessibility-statistics")]
    public Task<AccessibilityStatsDto> AccessibilityStatistics() => _city.GetAccessibilityStatisticsAsync();
}

[Authorize]
[ApiController]
[Route("api/housing")]
public class HousingController : ControllerBase
{
    private readonly HousingCertificationService _housing;
    public HousingController(HousingCertificationService housing) => _housing = housing;

    [HttpGet]
    public Task<IReadOnlyList<HousingDto>> GetAll() => _housing.GetAllAsync();

    [HttpGet("{id}")]
    public Task<HousingDto> Get(string id) => _housing.GetByIdAsync(id);

    [HttpGet("{id}/accessibility")]
    public async Task<AccessibilityDto> Accessibility(string id)
    {
        var dto = await _housing.GetByIdAsync(id);
        return dto.Accessibility;
    }

    [Authorize(Roles = "Municipality")]
    [HttpPatch("{id}/inspection/{itemKey}")]
    public Task<HousingDto> UpdateItem(string id, string itemKey, [FromBody] UpdateInspectionItemRequest body) =>
        _housing.UpdateInspectionItemAsync(id, itemKey, StatusCodec.ParseItem(body.Status));

    [Authorize(Roles = "Municipality")]
    [HttpPost("{id}/improve")]
    public Task<HousingDto> Improve(string id) => _housing.ApplyImprovementAsync(id);

    [Authorize(Roles = "Municipality")]
    [HttpPost("{id}/certify")]
    public Task<HousingDto> Certify(string id) => _housing.IssueCertificationAsync(id);

    [Authorize(Roles = "Municipality")]
    [HttpPost("{id}/conditional")]
    public Task<HousingDto> Conditional(string id) => _housing.IssueConditionalAsync(id);
}

[Authorize]
[ApiController]
[Route("api/businesses")]
public class BusinessesController : ControllerBase
{
    private readonly CatalogService _catalog;
    public BusinessesController(CatalogService catalog) => _catalog = catalog;

    [HttpGet]
    public Task<IReadOnlyList<BusinessDto>> Get() => _catalog.GetBusinessesAsync();
}

[Authorize]
[ApiController]
[Route("api/routes")]
public class RoutesController : ControllerBase
{
    private readonly CatalogService _catalog;
    public RoutesController(CatalogService catalog) => _catalog = catalog;

    [HttpGet]
    public Task<IReadOnlyList<RouteDto>> Get() => _catalog.GetRoutesAsync();
}

[Authorize]
[ApiController]
[Route("api/map")]
public class MapController : ControllerBase
{
    private readonly CatalogService _catalog;
    public MapController(CatalogService catalog) => _catalog = catalog;

    [HttpGet("housing")]
    public Task<IReadOnlyList<MapPinDto>> Housing() => _catalog.GetHousingPinsAsync();

    [HttpGet("businesses")]
    public Task<IReadOnlyList<MapPinDto>> Businesses() => _catalog.GetBusinessPinsAsync();

    [HttpGet("routes")]
    public Task<IReadOnlyList<MapRouteDto>> Routes() => _catalog.GetRoutePinsAsync();

    [HttpGet("problems")]
    public Task<IReadOnlyList<MapPinDto>> Problems() => _catalog.GetProblemPinsAsync();
}

[Authorize]
[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly FeedbackService _feedback;
    public FeedbackController(FeedbackService feedback) => _feedback = feedback;

    [HttpGet]
    public Task<FeedbackPageDto> Get() => _feedback.GetPageAsync();

    [Authorize(Roles = "Student")]
    [HttpPost]
    public Task<FeedbackDto> Post([FromBody] CreateFeedbackRequest body) => _feedback.SubmitAsync(body);
}
