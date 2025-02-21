using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository,
                           IJwtTokenService jwtTokenService,
                           ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                throw new System.Exception("User already exists with this email.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User(registerDto.Name, registerDto.Email, registerDto.Role, passwordHash);

            var createdUser = await _userRepository.AddAsync(newUser);

            string token = _jwtTokenService.GenerateToken(createdUser.Email, createdUser.Role);

            return new AuthResponseDto
            {
                UserId = createdUser.Id,
                Email = createdUser.Email,
                Role = createdUser.Role,
                Token = token
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                throw new System.Exception("Invalid email or password.");
            }

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isValidPassword)
            {
                throw new System.Exception("Invalid email or password.");
            }

            string token = _jwtTokenService.GenerateToken(user.Email, user.Role);

            return new AuthResponseDto
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                Token = token
            };
        }
    }
}
