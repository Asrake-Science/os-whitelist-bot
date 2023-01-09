local http_request = syn.request;
local body = http_request({Url = 'https://httpbin.org/get'; Method = 'GET'}).Body; -- this gets the users HWID to send over to the auth server
local decoded = game:GetService('HttpService'):JSONDecode(body)
local hwid = decoded.headers["Syn-Fingerprint"]
local request = syn.request({
  Url = "https://your-domain.com/auth",
  Method = "POST",
  Headers = {
    ["Content-Type"] = "application/json"
  },
  Body = game:GetService("HttpService"):JSONEncode({
    key = _G.Key, -- the BOT will send the script, with _G.Key = "KEY-HERE" and a loadstring for your-domain.com/loader
    hwid = hwid
  })
})

if request.StatusCode == 200 then
  local baba = syn.request({
  Url = "https://your-domain.com/script",
  Method = "GET",
  Headers = {
    ["fingerprint"] = tostring(_G.Key)
  }
});
print(baba.Body)
loadstring(baba.Body)()
else if request.StatusCode == 401 then
    game:GetService("Players").LocalPlayer:Kick("KICK-MESSAGE-HERE") -- customize this before obfuscating
    else
  game:GetService("Players").LocalPlayer:Kick("NO-ECONN-MESSAGE") -- put a message here if the auth server can't be contacted / isnt started up yet or crashed.
    end
end
