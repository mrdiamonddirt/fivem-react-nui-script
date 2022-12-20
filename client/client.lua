local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('show-nui', function()
  toggleNuiFrame(true)
  debugPrint('Show NUI frame')
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getClientData', function(data, cb)
  debugPrint('Data sent by React', json.encode(data))

-- Lets send back client coords to the React frame for use
  local curCoords = GetEntityCoords(PlayerPedId())

  local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
  cb(retData)
end)

RegisterNUICallback('spawnPed', function(data, cb)
  -- Validate input parameters
  if type(data) ~= "table" or type(data.model) ~= "string" or type(data.x) ~= "number" or type(data.y) ~= "number" or type(data.z) ~= "number" then
    error("Invalid input parameters")
  end

  debugPrint('Spawning Ped', json.encode(data))

  -- get player coords
  local playerCoords = GetEntityCoords(PlayerPedId())

  local model = GetHashKey(data.model)
  RequestModel(model)
  local timeout = GetGameTimer() + 5000 -- Timeout after 5 seconds
  while not HasModelLoaded(model) do
    if GetGameTimer() > timeout then
      error("Timed out waiting for model to load")
    end
    Wait(0)
  end

  local ped = CreatePed(4, model, playerCoords, 0.0, true, false)
  SetEntityAsMissionEntity(ped, true, true)
  SetModelAsNoLongerNeeded(model)

  -- Call the callback function with an empty table
  cb({})
end)