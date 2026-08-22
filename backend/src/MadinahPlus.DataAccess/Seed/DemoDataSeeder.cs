using MadinahPlus.DataAccess.Persistence;
using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.Services;
using MadinahPlus.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace MadinahPlus.DataAccess.Seed;

public static class DemoDataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        var existing = await db.CityProfiles.AsNoTracking().FirstOrDefaultAsync();
        if (existing?.Name.Ar == "بيرزيت")
        {
            await EnsureAccessibilityCategoryAsync(db);
            await EnsureDemoUsersAsync(db);
            return;
        }
        if (existing is not null) await ClearExistingAsync(db);

        db.CityProfiles.Add(new CityProfile
        {
            Name = T("بيرزيت", "Birzeit"),
            Tagline = T(
                "نموذج أولي لشهادة المدينة الصديقة للطلاب: يقيس السكن والاقتصاد الطلابي والسلامة والتنقل والمجتمع حول بيرزيت.",
                "A prototype for student-friendly city certification: it measures housing, student economy, safety, mobility and community around Birzeit."),
            OverallScore = 78,
            MapCenterLat = 31.9733,
            MapCenterLng = 35.1964,
            Dimensions = new List<CityDimension>
            {
                Dim("housing", "السكن", "Housing", 82, 3, 6, "وحدات في أبو قش بحاجة لتحسين التهوية", "Units in Abu Qash need ventilation upgrades", TrendDirection.Up, "62,68,73,78,82"),
                Dim("economy", "الاقتصاد الطلابي", "Student Economy", 75, 3, 7, "محال في البلدة لا تستوفي معايير الصداقة للطلاب", "Town businesses still miss student-friendly standards", TrendDirection.Up, "52,58,64,70,75"),
                Dim("safety", "السلامة والتنقل", "Safety & Mobility", 71, 2, 3, "إضاءة غير كافية على المسار ب بين السكن والجامعة", "Insufficient lighting on Route B between housing and campus", TrendDirection.Flat, "60,63,66,68,71"),
                Dim("community", "المجتمع", "Community", 84, 7, 9, "مشاركة طلابية محدودة في أنشطة البلدية الثقافية", "Limited student participation in municipal cultural activities", TrendDirection.Up, "70,74,78,81,84")
            }
        });

        db.ImprovementPriorities.AddRange(
            new ImprovementPriority
            {
                Id = "p1", Rank = 1, Severity = PrioritySeverity.High, Dimension = "housing",
                Text = T("وحدتان سكنيتان في أبو قش بحاجة لتحسين التهوية", "Two housing units in Abu Qash need ventilation improvements"),
                Impact = T("يؤثر على طلبة يسكنون بين أبو قش والحرم الجامعي — بيانات تجريبية", "Affects students living between Abu Qash and campus — prototype data"),
                Action = T("جدولة تفتيش بلدي خلال 14 يومًا وإصدار مهلة تصليح 30 يومًا", "Schedule municipal inspection within 14 days and issue a 30-day repair deadline")
            },
            new ImprovementPriority
            {
                Id = "p2", Rank = 2, Severity = PrioritySeverity.Medium, Dimension = "safety",
                Text = T("المسار ب يعاني من إضاءة غير كافية بعد الغروب", "Route B has insufficient lighting after sunset"),
                Impact = T("أكثر ممرات المشاة استخدامًا بين السكن والجامعة", "The most-used pedestrian path between housing and the university"),
                Action = T("تركيب أعمدة إنارة LED على المسار ب", "Install LED lighting poles along Route B")
            },
            new ImprovementPriority
            {
                Id = "p3", Rank = 3, Severity = PrioritySeverity.Medium, Dimension = "economy",
                Text = T("3 من 7 محال تفتيش لا تستوفي معايير الصداقة للطلاب", "Only 43% of inspected local businesses meet student-friendly criteria"),
                Impact = T("فرصة لاعتماد محال إضافية ضمن برنامج المدينة الصديقة للطلاب", "Chance to certify more shops under the student-friendly city program"),
                Action = T("إطلاق حملة اعتماد للمحال حول الحرم والبلدة", "Launch a certification campaign around campus and the old town")
            });

        db.MonitoringMetrics.AddRange(
            new MonitoringMetric { Key = "housing", Before = 64, After = 82, Unit = "score" },
            new MonitoringMetric { Key = "lighting", Before = 49, After = 71, Unit = "percent" },
            new MonitoringMetric { Key = "certifiedBusinesses", Before = 2, After = 4, Unit = "count" });

        db.HousingUnits.AddRange(
            House("h1", "سكن جامعة بيرزيت", "Birzeit University Residence", "دائرة الإسكان الطلابي", "Student Housing Department",
                "2026-08-12", "2026-08-12", "2027-08-12", 31.9598, 35.1835, "1,200 ₪/شهر", "1,200 ₪/mo", "0.3 كم", "0.3 km",
                Fac(("واي فاي", "WiFi"), ("مطبخ", "Kitchen"), ("غسالة", "Laundry"), ("حراسة", "Security"), ("إمكانية وصول لذوي الإعاقة", "Disability access")),
                Overrides(("elevator", InspectionItemStatus.Pass))),
            House("h2", "سكن أبو قش", "Abu Qash Residence", "جمعية الإسكان الطلابي - بيرزيت", "Birzeit Student Housing Association",
                "2026-08-10", null, null, 31.9512, 35.1888, "850 ₪/شهر", "850 ₪/mo", "1.1 كم", "1.1 km",
                Fac(("واي فاي", "WiFi"), ("تدفئة", "Heating")),
                Overrides(("ventilation", InspectionItemStatus.Needs), ("light", InspectionItemStatus.Needs), ("heating", InspectionItemStatus.Needs),
                    ("agreement", InspectionItemStatus.Needs), ("clean", InspectionItemStatus.Needs), ("internet", InspectionItemStatus.Needs),
                    ("roomsize", InspectionItemStatus.Needs),
                    ("wheelchair", InspectionItemStatus.Needs), ("entrance", InspectionItemStatus.Pass),
                    ("elevator", InspectionItemStatus.NotApplicable), ("bathroom", InspectionItemStatus.Needs),
                    ("doors", InspectionItemStatus.Pass), ("common", InspectionItemStatus.Needs),
                    ("circulation", InspectionItemStatus.Needs))),
            House("h3", "سكن جفنا", "Jifna Residence", "إسكان عائلي - جفنا", "Jifna Family Housing",
                "2026-08-08", null, null, 31.9965, 35.1992, "750 ₪/شهر", "750 ₪/mo", "3.2 كم", "3.2 km",
                Fac(("موقف", "Parking")),
                Overrides(("electrical", InspectionItemStatus.Needs), ("exit", InspectionItemStatus.Fail), ("ventilation", InspectionItemStatus.Fail),
                    ("water", InspectionItemStatus.Needs), ("residents", InspectionItemStatus.Fail), ("rent", InspectionItemStatus.Needs),
                    ("wheelchair", InspectionItemStatus.Fail), ("entrance", InspectionItemStatus.Fail),
                    ("elevator", InspectionItemStatus.NotApplicable), ("bathroom", InspectionItemStatus.Fail),
                    ("doors", InspectionItemStatus.Needs), ("common", InspectionItemStatus.Fail),
                    ("circulation", InspectionItemStatus.Fail))),
            House("h4", "سكن البلدة القديمة", "Old Town Residence", "عائلة قاسم", "Qasem Family Housing",
                "2026-08-05", "2026-08-05", "2027-08-05", 31.9736, 35.1968, "1,050 ₪/شهر", "1,050 ₪/mo", "1.8 كم", "1.8 km",
                Fac(("واي فاي", "WiFi"), ("مطبخ", "Kitchen"), ("إمكانية وصول لذوي الإعاقة", "Disability access")),
                Overrides(("light", InspectionItemStatus.Needs), ("common", InspectionItemStatus.Needs), ("elevator", InspectionItemStatus.NotApplicable))),
            House("h5", "سكن سردا", "Surda Residence", "تعاونية الإسكان الطلابي", "Student Housing Cooperative",
                "2026-08-14", null, null, 31.9668, 35.1712, "900 ₪/شهر", "900 ₪/mo", "1.6 كم", "1.6 km",
                Fac(("واي فاي", "WiFi"), ("غسالة", "Laundry")),
                Overrides(("internet", InspectionItemStatus.Needs), ("roomsize", InspectionItemStatus.Needs),
                    ("wheelchair", InspectionItemStatus.Needs), ("bathroom", InspectionItemStatus.Needs),
                    ("elevator", InspectionItemStatus.NotApplicable), ("common", InspectionItemStatus.Needs))),
            House("h6", "سكن عطارة", "Atara Residence", "برنامج السكن الآمن - بيرزيت", "Birzeit Safe Housing Program",
                "2026-08-11", "2026-08-11", "2027-08-11", 31.9820, 35.1685, "1,100 ₪/شهر", "1,100 ₪/mo", "2.4 كم", "2.4 km",
                Fac(("واي فاي", "WiFi"), ("مطبخ", "Kitchen"), ("تدفئة", "Heating"), ("إمكانية وصول لذوي الإعاقة", "Disability access")),
                Overrides(("extinguisher", InspectionItemStatus.Needs), ("elevator", InspectionItemStatus.NotApplicable))));

        db.Businesses.AddRange(
            Biz("b1", "كافيه الحرم", "Campus Café", "مقهى", "Café", 31.9588, 35.1818, true, true, true, true, "مساحة دراسة مسائية", "Evening study space"),
            Biz("b2", "مخبز بيرزيت", "Birzeit Bakery", "مخبز", "Bakery", 31.9724, 35.1952, true, true, true, true, "وجبة طالب مخفّضة", "Discounted student meal"),
            Biz("b3", "مكتبة البلدة", "Old Town Bookshop", "قرطاسية ومكتبة", "Stationery & Books", 31.9738, 35.1974, true, true, true, true, "خصم طلابي على الطباعة", "Student printing discount"),
            Biz("b4", "سوبرماركت أبو قش", "Abu Qash Market", "بقالة", "Grocery", 31.9518, 35.1896, false, true, false, false, "خصم طلابي على السلة الأسبوعية", "Student weekly-basket discount"),
            Biz("b5", "مغسلة سردا", "Surda Laundry", "خدمات", "Services", 31.9672, 35.1724, false, false, false, true, "خصم غسيل للطلبة", "Student laundry discount"),
            Biz("b6", "فرن جفنا", "Jifna Bakery", "مخبز", "Bakery", 31.9958, 35.1984, true, true, true, false, "وجبة طالب مخفّضة", "Discounted student meal"),
            Biz("b7", "مركز طباعة الحرم", "Campus Print Center", "خدمات طباعة", "Printing services", 31.9592, 35.1826, false, true, false, false, "خصم طلابي على الطباعة", "Student printing discount"));

        db.SafeRoutes.AddRange(
            Route("r-a", "مسار أبو قش–الجامعة", "Abu Qash–University Route", "مسار صديق للطلاب", "Student-friendly route",
                "سكن أبو قش", "Abu Qash housing", "الشارع الرئيسي", "Main road", "جامعة بيرزيت", "Birzeit University",
                CertificationStatus.Certified,
                new (double, double)[] { (31.9512, 35.1888), (31.9555, 35.1850), (31.9584, 35.1813) },
                true, true, true, true),
            Route("r-b", "المسار ب — البلدة–الجامعة", "Route B — Old Town–University", "قيد التحسين", "Under improvement",
                "سكن البلدة القديمة", "Old Town housing", "مدخل البلدة", "Town entrance", "جامعة بيرزيت", "Birzeit University",
                CertificationStatus.Conditional,
                new (double, double)[] { (31.9736, 35.1968), (31.9660, 35.1890), (31.9584, 35.1813) },
                false, true, true, false),
            Route("r-c", "مسار جفنا–الجامعة", "Jifna–University Route", "مسار صديق للطلاب", "Student-friendly route",
                "سكن جفنا", "Jifna housing", "الطريق الشمالي", "Northern road", "جامعة بيرزيت", "Birzeit University",
                CertificationStatus.Certified,
                new (double, double)[] { (31.9965, 35.1992), (31.9770, 35.1900), (31.9584, 35.1813) },
                true, true, true, false));

        db.FeedbackCategories.AddRange(
            new FeedbackCategory { Key = "housing", Label = T("السكن", "Housing") },
            new FeedbackCategory { Key = "safety", Label = T("السلامة", "Safety") },
            new FeedbackCategory { Key = "mobility", Label = T("التنقل", "Mobility") },
            new FeedbackCategory { Key = "business", Label = T("المحال التجارية", "Local Businesses") },
            new FeedbackCategory { Key = "community", Label = T("المجتمع", "Community") });

        db.StudentFeedback.AddRange(
            new StudentFeedback
            {
                Id = "f1", CategoryKey = "safety", Date = DateOnly.Parse("2026-08-09"),
                Text = T("الإضاءة ضعيفة مساءً على المسار ب بين البلدة والجامعة.", "Night lighting is weak on Route B between the old town and campus."),
                LinkedTo = T("السلامة ← الإضاءة ← المسار ب", "Safety → Lighting → Route B")
            },
            new StudentFeedback
            {
                Id = "f2", CategoryKey = "housing", Date = DateOnly.Parse("2026-08-07"),
                Text = T("التهوية ضعيفة في غرف سكن أبو قش خلال الصيف.", "Ventilation is weak in Abu Qash rooms during summer."),
                LinkedTo = T("السكن ← التهوية ← سكن أبو قش", "Housing → Ventilation → Abu Qash Residence")
            },
            new StudentFeedback
            {
                Id = "f3", CategoryKey = "business", Date = DateOnly.Parse("2026-08-03"),
                Text = T("قلة الخصم الطلابي الفعلي في محال البلدة باستثناء المخبز والمكتبة.", "Few real student discounts in town besides the bakery and bookshop."),
                LinkedTo = T("الاقتصاد الطلابي ← الأسعار ← محال البلدة", "Student Economy → Pricing → Town businesses")
            },
            new StudentFeedback
            {
                Id = "f4", CategoryKey = "mobility", Date = DateOnly.Parse("2026-08-11"),
                Text = T("معابر المشاة عند مدخل الجامعة مزدحمة وغير واضحة مساءً.", "Crossings at the university entrance are crowded and unclear at night."),
                LinkedTo = T("التنقل ← معابر المشاة ← مدخل الجامعة", "Mobility → Crossings → University entrance")
            },
            new StudentFeedback
            {
                Id = "f5", CategoryKey = "community", Date = DateOnly.Parse("2026-08-06"),
                Text = T("أنشطة البلدية الثقافية قليلة الإعلان للطلبة المقيمين حول الحرم.", "Municipal cultural activities are poorly advertised to students living near campus."),
                LinkedTo = T("المجتمع ← الأنشطة ← بلدية بيرزيت", "Community → Activities → Birzeit Municipality")
            });

        await db.SaveChangesAsync();
        await EnsureDemoUsersAsync(db);
    }

    private static async Task EnsureAccessibilityCategoryAsync(AppDbContext db)
    {
        var units = await db.HousingUnits
            .Include(h => h.Facilities)
            .Include(h => h.Inspection).ThenInclude(c => c.Items)
            .ToListAsync();

        foreach (var unit in units)
        {
            var stale = unit.Inspection.SelectMany(c => c.Items).Where(i => i.Key == "access").ToList();
            if (stale.Count > 0) db.InspectionItems.RemoveRange(stale);

            if (unit.Inspection.All(c => c.Key != "accessibility"))
            {
                unit.Inspection.Add(AccessibilityCategory(unit.Id));
            }

            var accessCat = unit.Inspection.FirstOrDefault(c => c.Key == "accessibility");
            var accessible = accessCat is not null &&
                InspectionScoringService.DeriveAccessibilityStatus(accessCat) == "Accessible";
            if (accessible && unit.Facilities.All(f => !f.Name.En.Contains("Disability") && !f.Name.Ar.Contains("إعاقة")))
            {
                unit.Facilities.Add(new HousingFacility { Name = T("إمكانية وصول لذوي الإعاقة", "Disability access") });
            }
            InspectionScoringService.Recalculate(unit);
        }

        await db.SaveChangesAsync();
    }

    private static InspectionCategory AccessibilityCategory(string housingId)
    {
        Dictionary<string, InspectionItemStatus> StatusFor() => housingId switch
        {
            "h2" => new()
            {
                ["wheelchair"] = InspectionItemStatus.Needs, ["entrance"] = InspectionItemStatus.Pass,
                ["elevator"] = InspectionItemStatus.NotApplicable, ["bathroom"] = InspectionItemStatus.Needs,
                ["doors"] = InspectionItemStatus.Pass, ["common"] = InspectionItemStatus.Needs,
                ["circulation"] = InspectionItemStatus.Needs
            },
            "h3" => new()
            {
                ["wheelchair"] = InspectionItemStatus.Fail, ["entrance"] = InspectionItemStatus.Fail,
                ["elevator"] = InspectionItemStatus.NotApplicable, ["bathroom"] = InspectionItemStatus.Fail,
                ["doors"] = InspectionItemStatus.Needs, ["common"] = InspectionItemStatus.Fail,
                ["circulation"] = InspectionItemStatus.Fail
            },
            "h4" => new() { ["common"] = InspectionItemStatus.Needs, ["elevator"] = InspectionItemStatus.NotApplicable },
            "h5" => new()
            {
                ["wheelchair"] = InspectionItemStatus.Needs, ["bathroom"] = InspectionItemStatus.Needs,
                ["elevator"] = InspectionItemStatus.NotApplicable, ["common"] = InspectionItemStatus.Needs
            },
            "h6" => new() { ["elevator"] = InspectionItemStatus.NotApplicable },
            _ => new() { ["elevator"] = InspectionItemStatus.Pass }
        };

        var map = StatusFor();
        InspectionItemStatus S(string key) => map.TryGetValue(key, out var s) ? s : InspectionItemStatus.Pass;
        return Cat("accessibility", "إتاحة السكن لذوي الإعاقة", "Accessibility for People with Disabilities", 5,
            Item("wheelchair", "إمكانية الوصول للكراسي المتحركة", "Wheelchair accessibility", S("wheelchair"), 0),
            Item("entrance", "مدخل مهيأ", "Accessible entrance", S("entrance"), 1),
            Item("elevator", "مصعد مهيأ عند الحاجة", "Elevator accessibility where applicable", S("elevator"), 2),
            Item("bathroom", "حمّام مهيأ", "Accessible bathroom", S("bathroom"), 3),
            Item("doors", "أبعاد الأبواب والممرات", "Appropriate door/access dimensions", S("doors"), 4),
            Item("common", "مناطق مشتركة مهيأة", "Accessible common areas", S("common"), 5),
            Item("circulation", "مسارات حركة واضحة", "Clear circulation paths", S("circulation"), 6));
    }

    private static async Task EnsureDemoUsersAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                email VARCHAR(256) NOT NULL,
                password_hash VARCHAR(500) NOT NULL,
                role INTEGER NOT NULL
            );
            """);
        await db.Database.ExecuteSqlRawAsync("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);");

        if (await db.Users.AnyAsync()) return;

        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<AppUser>();
        var student = new AppUser { Name = "Demo Student", Email = "student@demo.com", Role = UserRole.Student };
        student.PasswordHash = hasher.HashPassword(student, "Demo123!");
        var municipality = new AppUser { Name = "Demo Municipality Officer", Email = "municipality@demo.com", Role = UserRole.Municipality };
        municipality.PasswordHash = hasher.HashPassword(municipality, "Demo123!");
        db.Users.AddRange(student, municipality);
        await db.SaveChangesAsync();
    }

    private static async Task ClearExistingAsync(AppDbContext db)
    {
        await db.StudentFeedback.ExecuteDeleteAsync();
        await db.FeedbackCategories.ExecuteDeleteAsync();
        await db.InspectionItems.ExecuteDeleteAsync();
        await db.InspectionCategories.ExecuteDeleteAsync();
        await db.HousingFacilities.ExecuteDeleteAsync();
        await db.HousingUnits.ExecuteDeleteAsync();
        await db.BusinessCriteria.ExecuteDeleteAsync();
        await db.Businesses.ExecuteDeleteAsync();
        await db.RoutePoints.ExecuteDeleteAsync();
        await db.RouteCriteria.ExecuteDeleteAsync();
        await db.SafeRoutes.ExecuteDeleteAsync();
        await db.CityDimensions.ExecuteDeleteAsync();
        await db.CityProfiles.ExecuteDeleteAsync();
        await db.ImprovementPriorities.ExecuteDeleteAsync();
        await db.MonitoringMetrics.ExecuteDeleteAsync();
    }

    private static LocalizedText T(string ar, string en) => new(ar, en);

    private static CityDimension Dim(string key, string ar, string en, int score, int certified, int total, string pAr, string pEn, TrendDirection trend, string spark) =>
        new()
        {
            Key = key, Label = T(ar, en), Score = score, CertifiedCount = certified, TotalCount = total,
            Problems = T(pAr, pEn), Trend = trend, Sparkline = spark
        };

    private static List<HousingFacility> Fac(params (string ar, string en)[] items) =>
        items.Select(i => new HousingFacility { Name = T(i.ar, i.en) }).ToList();

    private static Dictionary<string, InspectionItemStatus> Overrides(params (string key, InspectionItemStatus status)[] items) =>
        items.ToDictionary(i => i.key, i => i.status);

    private static HousingUnit House(
        string id, string nameAr, string nameEn, string providerAr, string providerEn,
        string last, string? certified, string? expiry, double lat, double lng,
        string priceAr, string priceEn, string distAr, string distEn,
        List<HousingFacility> facilities, Dictionary<string, InspectionItemStatus> overrides)
    {
        var unit = new HousingUnit
        {
            Id = id,
            Name = T(nameAr, nameEn),
            Provider = T(providerAr, providerEn),
            LastInspection = DateOnly.Parse(last),
            CertifiedDate = certified is null ? null : DateOnly.Parse(certified),
            ExpiryDate = expiry is null ? null : DateOnly.Parse(expiry),
            Latitude = lat,
            Longitude = lng,
            Price = T(priceAr, priceEn),
            Distance = T(distAr, distEn),
            Facilities = facilities,
            Inspection = BuildInspection(overrides)
        };
        InspectionScoringService.Recalculate(unit);
        return unit;
    }

    private static List<InspectionCategory> BuildInspection(Dictionary<string, InspectionItemStatus> overrides)
    {
        InspectionItemStatus Status(string key) =>
            overrides.TryGetValue(key, out var s) ? s : InspectionItemStatus.Pass;

        return new List<InspectionCategory>
        {
            Cat("safety", "السلامة", "Safety", 0,
                Item("electrical", "سلامة الشبكة الكهربائية", "Electrical safety", Status("electrical"), 0),
                Item("extinguisher", "طفاية حريق", "Fire extinguisher", Status("extinguisher"), 1),
                Item("exit", "مخرج طوارئ", "Emergency exit", Status("exit"), 2)),
            Cat("health", "الصحة والتهوية", "Health & Ventilation", 1,
                Item("ventilation", "التهوية", "Ventilation", Status("ventilation"), 0),
                Item("light", "الإضاءة الطبيعية", "Natural lighting", Status("light"), 1),
                Item("clean", "النظافة العامة", "Cleanliness", Status("clean"), 2)),
            Cat("services", "الخدمات", "Services", 2,
                Item("water", "المياه", "Water", Status("water"), 0),
                Item("heating", "التدفئة", "Heating", Status("heating"), 1),
                Item("internet", "الإنترنت", "Internet", Status("internet"), 2)),
            Cat("occupancy", "الإشغال", "Occupancy", 3,
                Item("residents", "عدد الساكنين لكل غرفة", "Residents per room", Status("residents"), 0),
                Item("roomsize", "مساحة الغرفة", "Room size", Status("roomsize"), 1)),
            Cat("price", "السعر والحقوق", "Price & Rights", 4,
                Item("rent", "وضوح قيمة الإيجار", "Clear rent terms", Status("rent"), 0),
                Item("agreement", "عقد إيجار مكتوب", "Written agreement", Status("agreement"), 1)),
            Cat("accessibility", "إتاحة السكن لذوي الإعاقة", "Accessibility for People with Disabilities", 5,
                Item("wheelchair", "إمكانية الوصول للكراسي المتحركة", "Wheelchair accessibility", Status("wheelchair"), 0),
                Item("entrance", "مدخل مهيأ", "Accessible entrance", Status("entrance"), 1),
                Item("elevator", "مصعد مهيأ عند الحاجة", "Elevator accessibility where applicable", Status("elevator"), 2),
                Item("bathroom", "حمّام مهيأ", "Accessible bathroom", Status("bathroom"), 3),
                Item("doors", "أبعاد الأبواب والممرات", "Appropriate door/access dimensions", Status("doors"), 4),
                Item("common", "مناطق مشتركة مهيأة", "Accessible common areas", Status("common"), 5),
                Item("circulation", "مسارات حركة واضحة", "Clear circulation paths", Status("circulation"), 6))
        };
    }

    private static InspectionCategory Cat(string key, string ar, string en, int order, params InspectionItem[] items) =>
        new() { Key = key, Label = T(ar, en), SortOrder = order, Items = items };

    private static InspectionItem Item(string key, string ar, string en, InspectionItemStatus status, int order) =>
        new() { Key = key, Label = T(ar, en), Status = status, SortOrder = order };

    private static Business Biz(string id, string nameAr, string nameEn, string catAr, string catEn, double lat, double lng, bool certified, bool pricing, bool second, bool hours, string secondAr, string secondEn) =>
        new()
        {
            Id = id,
            Name = T(nameAr, nameEn),
            Category = T(catAr, catEn),
            Latitude = lat,
            Longitude = lng,
            Certified = certified,
            Criteria = new List<BusinessCriterion>
            {
                new() { Label = T("أسعار واضحة ومعلنة", "Transparent pricing"), Met = pricing, SortOrder = 0 },
                new() { Label = T(secondAr, secondEn), Met = second, SortOrder = 1 },
                new() { Label = T("ساعات عمل مناسبة للدراسة", "Study-friendly hours"), Met = hours, SortOrder = 2 }
            }
        };

    private static SafeRoute Route(string id, string nameAr, string nameEn, string labelAr, string labelEn,
        string fromAr, string fromEn, string viaAr, string viaEn, string toAr, string toEn,
        CertificationStatus status, (double lat, double lng)[] path, bool lighting, bool sidewalks, bool crossings, bool access) =>
        new()
        {
            Id = id,
            Name = T(nameAr, nameEn),
            Label = T(labelAr, labelEn),
            From = T(fromAr, fromEn),
            Via = T(viaAr, viaEn),
            To = T(toAr, toEn),
            Status = status,
            Path = path.Select((p, i) => new RoutePoint { SortOrder = i, Latitude = p.lat, Longitude = p.lng }).ToList(),
            Criteria = new List<RouteCriterion>
            {
                new() { Label = T("الإضاءة", "Lighting"), Met = lighting, SortOrder = 0 },
                new() { Label = T("الأرصفة", "Sidewalks"), Met = sidewalks, SortOrder = 1 },
                new() { Label = T("معابر المشاة", "Crossings"), Met = crossings, SortOrder = 2 },
                new() { Label = T("إمكانية الوصول", "Accessibility"), Met = access, SortOrder = 3 }
            }
        };
}
