using Domain.Entities;
using Infrastructure.DBs;
using Infrastructure.Service;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TataPlantAsset.Application.Tests.Fixtures;
using Xunit;

namespace TataPlantAsset.Application.Tests
{
    public class AssetMappingServiceTests : IClassFixture<DbContextFixture>
    {
        private readonly DbContextFixture _fixture;

        public AssetMappingServiceTests(DbContextFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetMappings_ShouldReturnSignals()
        {
            // Arrange
            var db = _fixture.CreateContext();

            db.Signals.Add(new Signal
            {
                SignalId = Guid.NewGuid(),
                SignalName = "Temperature",
                AssetId = Guid.NewGuid(),
                DeviceId = Guid.NewGuid()
            });

            await db.SaveChangesAsync();

            var service = new AssetMappingService(db);

            // Act
            var result = await service.GetMappings();

            // Assert
            Assert.Single(result);
        }
    }
}