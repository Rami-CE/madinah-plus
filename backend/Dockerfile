# Build + run ASP.NET Core API for Railway / Render / Fly
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MadinahPlus.sln ./
COPY src/MadinahPlus.Api/MadinahPlus.Api.csproj src/MadinahPlus.Api/
COPY src/MadinahPlus.Domain/MadinahPlus.Domain.csproj src/MadinahPlus.Domain/
COPY src/MadinahPlus.DataAccess/MadinahPlus.DataAccess.csproj src/MadinahPlus.DataAccess/

RUN dotnet restore src/MadinahPlus.Api/MadinahPlus.Api.csproj

COPY src/ src/
RUN dotnet publish src/MadinahPlus.Api/MadinahPlus.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MadinahPlus.Api.dll"]
