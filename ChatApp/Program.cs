using ChatApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

// SignalR
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(p =>
        p.SetIsOriginAllowed(_ => true)
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials());
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();   
app.UseStaticFiles();    
app.UseRouting();
app.UseCors();


app.MapHub<ChatHub>("/chatHub");

app.Run();
