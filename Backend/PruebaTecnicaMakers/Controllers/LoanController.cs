using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PruebaTecnicaMakers.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly ILoanService _loanService;
        public LoanController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoanDto loanDto)
        {
            var createdLoan = await _loanService.CreateLoanAsync(loanDto);
            return CreatedAtAction(nameof(Get), new { id = createdLoan.Id }, createdLoan);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var loan = await _loanService.GetLoanAsync(id);
            if (loan == null) return NotFound();
            return Ok(loan);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var loans = await _loanService.GetAllLoansAsync();
            return Ok(loans);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LoanDto loanDto)
        {
            if (id != loanDto.Id) return BadRequest("Mismatched loan ID.");
            var updatedLoan = await _loanService.UpdateLoanAsync(loanDto);
            if (updatedLoan == null) return NotFound();
            return Ok(updatedLoan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _loanService.DeleteLoanAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(int id)
        {
            var result = await _loanService.ApproveLoanAsync(id);
            if (!result) return BadRequest(new { message = "Loan approval failed." });
            return Ok(new { message = "Loan approved successfully." });
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(int id)
        {
            var result = await _loanService.RejectLoanAsync(id);
            if (!result) return BadRequest(new { message = "Loan rejection failed." });
            return Ok(new { message = "Loan rejected successfully." });
        }
    }
}
