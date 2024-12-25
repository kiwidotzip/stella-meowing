import { chunkLoaded } from "./utils";

/*  ------------ Dungeon Utilities --------------

    Dungeon related utilites

    ------------------- To Do -------------------

    - Switch coord conversion to bm stuff

    --------------------------------------------- */

//load rooms list
export const rooms = JSON.parse(
  FileLib.read("eclipseAddons", "data/dungeons/roomdata.json")
);

//load routes
export var routes = JSON.parse(
  FileLib.read("eclipseAddons", "data/dungeons/routes/routes.json")
);

//checks if your in dungeons based on the scorebord
export const inDungeon = () => {
  let names = ChatLib.removeFormatting(Object.values(TabList.getNames()));
  let cataMatch = names.match("Dungeon: Catacombs");

  if (cataMatch) return true;

  return false;
};

//thanks bm
export const getPos = () => {
  let worldX = Math.floor((Player.getX() + 200.5) / 32);
  let worldZ = Math.floor((Player.getZ() + 200.5) / 32);

  let roomComponentArray = [];

  for (let i = 0; i < 36; i++) {
    let x = i % 6;
    let z = Math.floor(i / 6);
    let rx = -185 + x * 32;
    let rz = -185 + z * 32;
    roomComponentArray[i] = [rx, rz];
  }

  const index = worldX + worldZ * 6;

  if (index < 0 || index > 35) return null;

  return roomComponentArray[index];
};

const blacklisted = [
  101, // Iron Bars
  54, // Chest
];
export const hashCode = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0); // From https://stackoverflow.com/a/15710692/15767968

/**
 * Gets the core hash at a certain x, z position
 * @param {Number} x
 * @param {Number} z
 * @returns
 */
export const getCore = () => {
  if (!getPos()) return;

  let [x, z] = getPos();

  if (!chunkLoaded(x, 68, z)) return;

  let blockIds = "";
  for (let y = 140; y >= 12; y--) {
    let block = World.getBlockAt(x, y, z);
    // Blacklisted blocks should just be counted as air.
    if (blacklisted.includes(block.type.getID())) {
      blockIds += "0";
      continue;
    }

    blockIds += block.type.getID();
  }

  return hashCode(blockIds);
};

//kinda self explanitory
export const getRoomID = () => {
  let roomCore = getCore();
  if (!roomCore) return;

  for (var i = 0; i < rooms.length; i++) {
    for (var j = 0; j < 5; j++) {
      if (roomCore === rooms[i].cores[j]) {
        return rooms[i].id;
      }
    }
  }

  return null;
};

//gets room name based on room id
export const getRoomName = () => {
  let roomCore = getCore();
  if (!roomCore) return;

  for (var i = 0; i < rooms.length; i++) {
    for (var j = 0; j < 5; j++) {
      if (roomCore === rooms[i].cores[j]) {
        return rooms[i].name;
      }
    }
  }
  return "Room Not Found";
};

//pulls room data from the roomData.json file
export const getRoomData = () => {
  let roomCore = getCore();
  if (!roomCore) return;

  for (var i = 0; i < rooms.length; i++) {
    for (var j = 0; j < 5; j++) {
      if (roomCore === rooms[i].cores[j]) {
        return rooms[i];
      }
    }
  }

  return null;
};

//pulls route data for current room from the routes.json file
export const getRouteData = () => {
  let id = getRoomData().rid;
  if (!id) return;

  let routeData = Object.keys(routes);
  for (var i = 0; i < routeData.length; i++) {
    if (routeData[i] === id) return Object.values(routes)[i];
  }

  return null;
};


//soopy coord conversion
/*
//used to get highest block
export const getRoofAt = (x, z) => {
  let y = 255;
  while (
    y > 0 &&
    World.getBlockStateAt(new BlockPos(x, y, z)).getBlockId() === 0
  )
    y--;

  return y;
};

//returns room world data. for example: corner, center, width, hight, ect
export const getRoomWorldData = () => {
  let x = Math.floor((Player.getX() + 8) / 32) * 32 - 8;
  let y = Math.floor((Player.getZ() + 8) / 32) * 32 - 8;
  let width = 30;
  let height = 30;

  let roofY = getRoofAt(x, y);

  while (
    World.getBlockStateAt(new BlockPos(x - 1, roofY, y)).getBlockId() !== 0
  ) {
    x -= 32;
    width += 32;
  }
  while (
    World.getBlockStateAt(new BlockPos(x, roofY, y - 1)).getBlockId() !== 0
  ) {
    y -= 32;
    height += 32;
  }
  while (
    World.getBlockStateAt(new BlockPos(x - 1, roofY, y)).getBlockId() !== 0
  ) {
    //second iteration incase of L shape
    x -= 32;
    width += 32;
  }
  while (
    World.getBlockStateAt(
      new BlockPos(x + width + 1, roofY, y)
    ).getBlockId() !== 0
  ) {
    width += 32;
  }
  while (
    World.getBlockStateAt(
      new BlockPos(x, roofY, y + height + 1)
    ).getBlockId() !== 0
  ) {
    height += 32;
  }
  while (
    World.getBlockStateAt(
      new BlockPos(x + width, roofY, y + height + 1)
    ).getBlockId() !== 0
  ) {
    //second iteration incase of L shape
    height += 32;
  }
  while (
    World.getBlockStateAt(
      new BlockPos(x + width + 1, roofY, y + height)
    ).getBlockId() !== 0
  ) {
    //second iteration incase of L shape
    width += 32;
  }
  while (
    World.getBlockStateAt(
      new BlockPos(x + width, roofY, y - 1)
    ).getBlockId() !== 0
  ) {
    //second iteration incase of L shape
    y -= 32;
    height += 32;
  }
  while (
    World.getBlockStateAt(
      new BlockPos(x - 1, roofY, y + height)
    ).getBlockId() !== 0
  ) {
    //third iteration incase of L shape
    x -= 32;
    width += 32;
  }

  return {
    x,
    y,
    width,
    height,
    cx: x + width / 2,
    cy: y + height / 2,
    cz: roofY,
    rotation: getRotation(x, y, width, height, roofY),
  };
};

//gets the rotation of the room
export const getRotation = (x, y, width, height, roofY) => {
  let currRoomData = getRoomData();
  if (!currRoomData) return -1;

  if (currRoomData.shape !== "L") {
    if (getTopBlockAt(x, y, roofY) === 11) return 1;
    if (getTopBlockAt(x + width, y, roofY) === 11) return 2;
    if (getTopBlockAt(x + width, y + height, roofY) === 11) return 3;
    if (getTopBlockAt(x, y + height, roofY) === 11) return 4;
  } else {
    let one = getTopBlockAt2(x + width / 2 + 1, y + height / 2, roofY);
    let two = getTopBlockAt2(x + width / 2 - 1, y + height / 2, roofY);
    let three = getTopBlockAt2(x + width / 2, y + height / 2 + 1, roofY);
    let four = getTopBlockAt2(x + width / 2, y + height / 2 - 1, roofY);

    if (one === 0 && four === 0) return 1;
    if (one === 0 && three === 0) return 2;
    if (two === 0 && three === 0) return 3;
    if (two === 0 && four === 0) return 4;
  }

  return -1;
};

//self explanitory
export const getTopBlockAt = (x, z, y) => {
  if (!y) y = getHeightAt(x, z);

  return World.getBlockStateAt(new BlockPos(x, y, z)).getMetadata();
};

export const getTopBlockAt2 = (x, z, y) => {
  if (!y) y = getHeightAt(x, z);

  return World.getBlockStateAt(new BlockPos(x, y, z)).getBlockId();
};


//rotates coordnates
export const rotateCoords = ([x, y, z], degree) => {
  if (degree == 1) return [x, y, z];
  if (degree == 2) return [-z, y, x];
  if (degree == 3) return [-x, y, -z];
  if (degree == 4) return [z, y, -x];

  return [x, y, z];
};

export const unRotateCoords = ([x, y, z], degree) => {
  if (degree == 1) return [x, y, z];
  if (degree == 2) return [z, y, -x];
  if (degree == 3) return [-x, y, -z];
  if (degree == 4) return [-z, y, x];

  return [x, y, z];
};

//translates relitive room coords to real world coords
export const getRoomCoord = ([x, y, z], roomData) => {
  let roomCorner = null;
  let coord = [x, y, z];
  if (roomData.rotation === 1) roomCorner = [roomData.x, 0, roomData.y];
  if (roomData.rotation === 2)
    roomCorner = [roomData.x + roomData.width, 0, roomData.y];
  if (roomData.rotation === 3)
    roomCorner = [roomData.x + roomData.width, 0, roomData.y + roomData.height];
  if (roomData.rotation === 4)
    roomCorner = [roomData.x, 0, roomData.y + roomData.height];
  const roomCoord = unRotateCoords(
    coord.map((v, i) => v - roomCorner[i]),
    roomData.rotation
  );

  return roomCoord;
};

export const getRealCoord = ([x, y, z], roomData) => {
  let roomCorner = null;
  const rotated = rotateCoords([x, y, z], roomData.rotation);
  if (roomData.rotation === 1) roomCorner = [roomData.x, 0, roomData.y];
  if (roomData.rotation === 2)
    roomCorner = [roomData.x + roomData.width, 0, roomData.y];
  if (roomData.rotation === 3)
    roomCorner = [roomData.x + roomData.width, 0, roomData.y + roomData.height];
  if (roomData.rotation === 4)
    roomCorner = [roomData.x, 0, roomData.y + roomData.height];
  const realCoord = rotated.map((v, i) => v + roomCorner[i]);

  return realCoord;
};
*/


//bm coord conversion

findRotationAndCorner() {
  // Roof height is needed to find stained clay
  //if (!this.roofHeight) return
  let type = getRoomData().type
  if (type == "fairy") {
      let rotation = 0
      let [x, z] = getPos()

      let corner = [x-15.5, 0, z-15.5]
      return [rotation, corner]
  }

  let components = getPos()

  const minX = Math.min(...components.map(a => a.worldX))
  const maxX = Math.max(...components.map(a => a.worldX))
  const minY = Math.min(...components.map(a => a.worldY))
  const maxY = Math.max(...components.map(a => a.worldY))

  // Corners of the room, in clockwise order from top left
  const spots = [
      [minX - 15, minY - 15],
      [maxX + 15, minY - 15],
      [maxX + 15, maxY + 15],
      [minX - 15, maxY + 15]
  ]

  for (let i = 0; i < spots.length; i++) {
      let [x, z] = spots[i]

      if (!chunkLoaded(x, this.roofHeight, z)) return

      // Looking for blue stained hardened clay at the corner of the room
      let block = World.getBlockAt(x, this.roofHeight, z)
      if (block.type.getID() !== 159 || block.getMetadata() !== 11) continue

      this.rotation = i
      this.corner = [x+0.5, 0, z+0.5]
      return
  }
}

getRoomCoord(coord, ints=true) {
  if (this.rotation == null || !this.corner) return null

  const cornerCoord = ints ? this.corner.map(Math.floor) : this.corner
  const roomCoord = rotateCoords(coord.map((v, i) => v - cornerCoord[i]), this.rotation)

  if (ints) return roomCoord.map(Math.floor)
  
  return roomCoord
}