const floors = [
  {
    title: "一楼",
    path: "./assets/rooms/floor1",
    scenes: [
      { dir: "01-南房", faces: ["l", "r", "f", "b", "u", "d"] },
      "02-南房",
      "03-南房",
      "04-主卧",
      "05-主卫",
      "06-次卫",
      "07-过道",
      "08-主卧",
      "09-主卫",
      "10-过道",
      "11-客厅",
      "12-餐厅",
      "13-厨房",
    ],
  },
  {
    title: "二楼",
    path: "./assets/rooms/floor2",
    scenes: [
      "01-主卧",
      "02-主卫",
      "03-次卧1",
      "04-次卧2",
      "05-客厅",
      "06-主卧",
      "07-次卫",
      "08-次卫",
      "09-过道",
    ],
  },
  {
    title: "三楼",
    path: "./assets/rooms/floor3",
    scenes: ["01-阁楼"],
  },
];

const faces = ["f", "r", "b", "l", "u", "d"];
const floorNav = document.querySelector("#floorNav");
const sceneList = document.querySelector("#sceneList");
const toggleScenes = document.querySelector("#toggleScenes");
const viewerElement = document.querySelector("#viewer");
const yawAdjuster = document.querySelector("#yawAdjuster");
const yawLeft = document.querySelector("#yawLeft");
const yawRight = document.querySelector("#yawRight");
const yawReset = document.querySelector("#yawReset");
const yawValue = document.querySelector("#yawValue");
let viewer;
let activeFloorIndex = 0;
let activeSceneIndex = 0;
const roomYawOffset = {
  "assets/rooms/floor1/01-南房": 90,
};

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function getRoomPathKey(path) {
  return path?.replace(/^\.\//, "");
}

function currentRoomKey(room) {
  return getRoomPathKey(room.path);
}

function cubeMapFor(room) {
  return (room.faces || faces).map((face) => `${room.path}/pano_${face}.jpg`);
}

function loadRoom(room) {
  if (viewer) viewer.destroy();
  viewerElement.replaceChildren();
  const roomKey = currentRoomKey(room);
  const roomYaw = roomYawOffset[roomKey] || 0;
  const yaw = normalizeAngle((room.yaw || 0) + roomYaw);

  const isProblemRoom = roomKey === "assets/rooms/floor1/01-南房";
  if (yawAdjuster) {
    yawAdjuster.hidden = !isProblemRoom;
    if (isProblemRoom && yawValue) {
      yawValue.textContent = `南房朝向补偿: ${roomYaw}°`;
    }
  }

  viewer = pannellum.viewer("viewer", {
    type: "cubemap",
    cubeMap: cubeMapFor(room),
    autoLoad: true,
    showControls: true,
    compass: false,
    yaw,
    pitch: 0,
    hfov: room.hfov || 82,
    minHfov: room.hfov || 82,
    maxHfov: room.hfov || 82,
    mouseZoom: false,
    keyboardZoom: false,
  });
}

function adjustProblemRoomYaw(delta) {
  const rooms = scenesFor(floors[activeFloorIndex]);
  const room = rooms[activeSceneIndex];
  const roomKey = currentRoomKey(room);
  if (roomKey !== "assets/rooms/floor1/01-南房") return;
  roomYawOffset[roomKey] = normalizeAngle((roomYawOffset[roomKey] || 0) + delta);
  loadRoom(room);
}

if (yawLeft) {
  yawLeft.addEventListener("click", () => adjustProblemRoomYaw(-90));
}
if (yawRight) {
  yawRight.addEventListener("click", () => adjustProblemRoomYaw(90));
}
if (yawReset) {
  yawReset.addEventListener("click", () => {
    const rooms = scenesFor(floors[activeFloorIndex]);
    const room = rooms[activeSceneIndex];
    const roomKey = currentRoomKey(room);
    if (roomKey === "assets/rooms/floor1/01-南房") {
      roomYawOffset[roomKey] = 0;
      loadRoom(room);
    }
  });
}

function scenesFor(floor) {
  return floor.scenes.map((scene) => {
    const name = typeof scene === "string" ? scene : scene.dir;
    return {
      title: name.replace(/^\d+-/, ""),
      path: `${floor.path}/${name}`,
      yaw: scene.yaw || 0,
      hfov: scene.hfov,
      faces: scene.faces,
    };
  });
}

function renderFloors() {
  floorNav.replaceChildren();

  floors.forEach((floor, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `floor-button${index === activeFloorIndex ? " is-active" : ""}`;
    button.textContent = floor.title;
    button.addEventListener("click", () => loadFloor(index));
    floorNav.append(button);
  });
}

function renderScenes(rooms) {
  sceneList.replaceChildren();

  rooms.forEach((room, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const title = document.createElement("span");

    button.type = "button";
    button.className = `scene-card${index === activeSceneIndex ? " is-active" : ""}`;
    image.src = `${room.path}/pano_f.jpg`;
    image.alt = room.title;
    title.textContent = room.title;

    button.append(image, title);
    button.addEventListener("click", () => {
      activeSceneIndex = index;
      renderScenes(rooms);
      loadRoom(room);
    });
    sceneList.append(button);
  });
}

function loadFloor(index) {
  activeFloorIndex = index;
  activeSceneIndex = 0;

  const rooms = scenesFor(floors[index]);
  renderFloors();
  renderScenes(rooms);
  loadRoom(rooms[0]);
}

toggleScenes.addEventListener("click", () => {
  sceneList.hidden = !sceneList.hidden;
  toggleScenes.firstChild.textContent = sceneList.hidden ? "展开分组 " : "收起分组 ";
});

loadFloor(0);
