
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fintcs.Api.Services;
using Fintcs.Api.DTOs;

namespace Fintcs.Api.Controllers
{
    [Authorize]
    public class SocietiesController : BaseController
    {
        private readonly ISocietyService _societyService;

        public SocietiesController(ISocietyService societyService)
        {
            _societyService = societyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSocieties()
        {
            try
            {
                var societies = await _societyService.GetSocietiesAsync();
                return Ok(societies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSociety(string id)
        {
            try
            {
                var society = await _societyService.GetSocietyByIdAsync(id);
                if (society == null)
                    return NotFound();

                return Ok(society);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSociety([FromBody] CreateSocietyDto createSocietyDto)
        {
            try
            {
                var society = await _societyService.CreateSocietyAsync(createSocietyDto);
                return CreatedAtAction(nameof(GetSociety), new { id = society.Id }, society);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSociety(string id, [FromBody] UpdateSocietyDto updateSocietyDto)
        {
            try
            {
                var society = await _societyService.UpdateSocietyAsync(id, updateSocietyDto);
                return Ok(society);
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSociety(string id)
        {
            try
            {
                await _societyService.DeleteSocietyAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    }
}
