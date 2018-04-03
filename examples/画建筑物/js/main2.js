var scene, camera
var renderer
var width, height,controls
var cars = []
// var stats

var config = {
    isMobile: false,
    background: 0x282828
}

width = window.innerWidth
height = window.innerHeight

scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000)
camera.position.set(330, 330, 330)
camera.lookAt(scene.position)

renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(width, height)
renderer.setClearColor(config.background)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
//检测设备是电脑还是手机
checkUserAgent();
//设置马路网格
buildAuxSystem();
// 设置道路
buildRoad();
// 设置灯光
// buildLightSystem()

loop()



function checkUserAgent() {
    var n = navigator.userAgent;
    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i)) {
        config.isMobile = true
        camera.position.set(420, 420, 420)
        renderer.shadowMap.enabled = false
    }
}
function buildLightSystem() {

    if (!config.isMobile) {
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
        directionalLight.position.set(300, 1000, 500);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;

        var d = 300;
        directionalLight.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 500, 1600);
        directionalLight.shadow.bias = 0.0001;
        directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight)

        var light = new THREE.AmbientLight(0xffffff, 0.3)
        scene.add(light)
    } else {
        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 1)
        scene.add(hemisphereLight)

        var light = new THREE.AmbientLight(0xffffff, 0.15)
        scene.add(light)
    }

}

function buildRoad() {
    var road = new THREE.Object3D()
    var roadColor = 0xffffff
    var roadBorderOuterCoords = [
        [-200, 200],
        [-200, -200],
        [200, -200],
        [200, 200]
    ]
    var roadBorderOuterHoleCoords = [
        [-199, 199],
        [-199, -199],
        [199, -199],
        [199, 199]
    ]
    var roadBorderOuterShape = utils.makeShape(roadBorderOuterCoords, roadBorderOuterHoleCoords)
    var roadBorderOuterGeometry = utils.makeExtrudeGeometry(roadBorderOuterShape, 0.1)
    var roadBorderOuter = utils.makeMesh('phong', roadBorderOuterGeometry, roadColor)
    road.add(roadBorderOuter)

    var roadBorderInnerCoords = [

    ]
    var roadBorderInnerShape = utils.makeShape(roadBorderInnerCoords)
    var roadBorderInnnerGeometry = utils.makeExtrudeGeometry(roadBorderInnerShape, 0.1)
    var roadBoaderInnder = utils.makeMesh('phong', roadBorderInnnerGeometry, roadColor)
    // roadBoaderInnder.rotation.y = Math.PI
    road.add(roadBoaderInnder)

    var roadLinesGeometry = new THREE.Geometry()
    var roadLineGeometry = new THREE.BoxGeometry(20, 0.1, 2)

    var roadLinesBottomGeometry = new THREE.Geometry()
    for (var i = 0; i < 9; i++) {
        var geometry = roadLineGeometry.clone()
        geometry.translate(i * 30, 0, -1)
        roadLinesBottomGeometry.merge(geometry)
    }
    roadLinesBottomGeometry.translate(-120, 0, 145)
    roadLinesGeometry.merge(roadLinesBottomGeometry)

    var roadLinesTopGeometry = roadLinesBottomGeometry.clone()
    roadLinesTopGeometry.translate(0, 0, -290)
    roadLinesGeometry.merge(roadLinesTopGeometry)

    var roadLinesLeftGeometry = roadLinesBottomGeometry.clone()
    roadLinesLeftGeometry.rotateY(0.5 * Math.PI)
    roadLinesGeometry.merge(roadLinesLeftGeometry)

    var roadLinesRightGeometry = roadLinesBottomGeometry.clone()
    roadLinesRightGeometry.rotateY(-0.5 * Math.PI)
    roadLinesGeometry.merge(roadLinesRightGeometry)
    roadLinesGeometry = new THREE.BufferGeometry().fromGeometry(roadLinesGeometry)
    var roadLines = utils.makeMesh('phong', roadLinesGeometry, roadColor)
    // road.add(roadLines)

    scene.add(road)
}
function buildAuxSystem() {
    // stats = new Stats()
    // stats.setMode(0)
    // stats.domElement.style.position = 'absolute'
    // stats.domElement.style.left = '5px'
    // stats.domElement.style.top = '5px'
    // document.body.appendChild(stats.domElement)

    // var axisHelper = new THREE.AxesHelper(200)
    // scene.add(axisHelper)

    var gridHelper = new THREE.GridHelper(400, 40)//设置网格宽度和网格等分数
    scene.add(gridHelper)

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true//使动画循环使用时阻尼或自转 意思是否有惯性
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    controls.dampingFactor = 0.25
    controls.rotateSpeed = 0.35
}
function loop(){
    controls.update();
    // stats.update()
    // cars.forEach(function(car) {
    //     carMoving(car)
    // })
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
}
