using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MadinahPlus.DataAccess.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "businesses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    name_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    category_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    category_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    Certified = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_businesses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "city_profiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    name_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    tagline_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    tagline_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    OverallScore = table.Column<int>(type: "integer", nullable: false),
                    MapCenterLat = table.Column<double>(type: "double precision", nullable: false),
                    MapCenterLng = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_city_profiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "feedback_categories",
                columns: table => new
                {
                    Key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_feedback_categories", x => x.Key);
                });

            migrationBuilder.CreateTable(
                name: "housing_units",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    name_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    provider_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    provider_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    LastInspection = table.Column<DateOnly>(type: "date", nullable: true),
                    CertifiedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ExpiryDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    price_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    price_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    distance_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    distance_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ConditionalIssued = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_housing_units", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "improvement_priorities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Rank = table.Column<int>(type: "integer", nullable: false),
                    Severity = table.Column<int>(type: "integer", nullable: false),
                    Dimension = table.Column<string>(type: "text", nullable: false),
                    text_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    text_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    impact_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    impact_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    action_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    action_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_improvement_priorities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "monitoring_metrics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Before = table.Column<int>(type: "integer", nullable: false),
                    After = table.Column<int>(type: "integer", nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_monitoring_metrics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "safe_routes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    name_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    from_point_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    from_point_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    via_point_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    via_point_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    to_point_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    to_point_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_safe_routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "business_criteria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BusinessId = table.Column<string>(type: "character varying(32)", nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Met = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_business_criteria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_business_criteria_businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "city_dimensions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CityProfileId = table.Column<int>(type: "integer", nullable: false),
                    Key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    CertifiedCount = table.Column<int>(type: "integer", nullable: false),
                    TotalCount = table.Column<int>(type: "integer", nullable: false),
                    problems_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    problems_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Trend = table.Column<int>(type: "integer", nullable: false),
                    Sparkline = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_city_dimensions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_city_dimensions_city_profiles_CityProfileId",
                        column: x => x.CityProfileId,
                        principalTable: "city_profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "student_feedback",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CategoryKey = table.Column<string>(type: "character varying(64)", nullable: false),
                    text_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    text_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    linked_to_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    linked_to_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_student_feedback", x => x.Id);
                    table.ForeignKey(
                        name: "FK_student_feedback_feedback_categories_CategoryKey",
                        column: x => x.CategoryKey,
                        principalTable: "feedback_categories",
                        principalColumn: "Key",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "housing_facilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HousingUnitId = table.Column<string>(type: "character varying(32)", nullable: false),
                    name_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    name_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_housing_facilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_housing_facilities_housing_units_HousingUnitId",
                        column: x => x.HousingUnitId,
                        principalTable: "housing_units",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "inspection_categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HousingUnitId = table.Column<string>(type: "character varying(32)", nullable: false),
                    Key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inspection_categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_inspection_categories_housing_units_HousingUnitId",
                        column: x => x.HousingUnitId,
                        principalTable: "housing_units",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "route_criteria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SafeRouteId = table.Column<string>(type: "character varying(32)", nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Met = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route_criteria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_route_criteria_safe_routes_SafeRouteId",
                        column: x => x.SafeRouteId,
                        principalTable: "safe_routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "route_points",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SafeRouteId = table.Column<string>(type: "character varying(32)", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route_points", x => x.Id);
                    table.ForeignKey(
                        name: "FK_route_points_safe_routes_SafeRouteId",
                        column: x => x.SafeRouteId,
                        principalTable: "safe_routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "inspection_items",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InspectionCategoryId = table.Column<int>(type: "integer", nullable: false),
                    Key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    label_ar = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    label_en = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inspection_items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_inspection_items_inspection_categories_InspectionCategoryId",
                        column: x => x.InspectionCategoryId,
                        principalTable: "inspection_categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_business_criteria_BusinessId",
                table: "business_criteria",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_city_dimensions_CityProfileId",
                table: "city_dimensions",
                column: "CityProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_housing_facilities_HousingUnitId",
                table: "housing_facilities",
                column: "HousingUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_inspection_categories_HousingUnitId",
                table: "inspection_categories",
                column: "HousingUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_inspection_items_InspectionCategoryId",
                table: "inspection_items",
                column: "InspectionCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_route_criteria_SafeRouteId",
                table: "route_criteria",
                column: "SafeRouteId");

            migrationBuilder.CreateIndex(
                name: "IX_route_points_SafeRouteId",
                table: "route_points",
                column: "SafeRouteId");

            migrationBuilder.CreateIndex(
                name: "IX_student_feedback_CategoryKey",
                table: "student_feedback",
                column: "CategoryKey");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "business_criteria");

            migrationBuilder.DropTable(
                name: "city_dimensions");

            migrationBuilder.DropTable(
                name: "housing_facilities");

            migrationBuilder.DropTable(
                name: "improvement_priorities");

            migrationBuilder.DropTable(
                name: "inspection_items");

            migrationBuilder.DropTable(
                name: "monitoring_metrics");

            migrationBuilder.DropTable(
                name: "route_criteria");

            migrationBuilder.DropTable(
                name: "route_points");

            migrationBuilder.DropTable(
                name: "student_feedback");

            migrationBuilder.DropTable(
                name: "businesses");

            migrationBuilder.DropTable(
                name: "city_profiles");

            migrationBuilder.DropTable(
                name: "inspection_categories");

            migrationBuilder.DropTable(
                name: "safe_routes");

            migrationBuilder.DropTable(
                name: "feedback_categories");

            migrationBuilder.DropTable(
                name: "housing_units");
        }
    }
}
