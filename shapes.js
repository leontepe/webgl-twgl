function cube(a) {
    return cuboid(a, a, a)
}

function cuboid(w, h, d) {

    const faces = 6
    const numVertices = 4 * faces

    const l = Math.max(w,h,d)

    w2 = w / 2
    h2 = h / 2
    d2 = d / 2

    const positions = [
        w2, h2, -d2,
        w2, h2, d2,
        w2, -h2, d2,
        w2, -h2, -d2,

        -w2, h2, d2,
        -w2, h2, -d2,
        -w2, -h2, -d2,
        -w2, -h2, d2,

        -w2, h2, d2,
        w2, h2, d2,
        w2, h2, -d2,
        -w2, h2, -d2,

        -w2, -h2, -d2,
        w2, -h2, -d2,
        w2, -h2, d2,
        -w2, -h2, d2,

        w2, h2, d2,
        -w2, h2, d2,
        -w2, -h2, d2,
        w2, -h2, d2,

        -w2, h2, -d2,
        w2, h2, -d2,
        w2, -h2, -d2,
        -w2, -h2, -d2
    ]

    const normals = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]

    const wl = w / l
    const hl = h / l
    const dl = d / l

    const texcoords = [
        // left
        // h * d
        dl, 0,
        0, 0,
        0, hl,
        dl, hl,

        // right
        // h * d
        dl, 0,
        0, 0,
        0, hl,
        dl, hl,

        // top
        // w * d
        wl, 0,
        0, 0,
        0, dl,
        wl, dl,

        // bottom
        // w * d
        wl, 0,
        0, 0,
        0, dl,
        wl, dl,

        // back
        // w * h
        wl, 0,
        0, 0,
        0, hl,
        wl, hl,

        // front
        // w * h
        wl, 0,
        0, 0,
        0, hl,
        wl, hl
    ]


    // indices should stay the same for cuboids and cubes
    const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]

    return {
        arrays: {
            position: positions,
            normal: normals,
            texcoord: texcoords,
            indices: indices
        },
        texSrc: defaultSrc(l)
    };
}

// l1 = longest side
// l2 = second longest side
const defaultSrc = (l) => {
    const c1 = [255, 255, 255, 255]
    const c2 = [192, 192, 192, 255]
    
    let src = []
    
    for(let i = 0; i < l; i++) {
        for (let j = 0; j < l /* l2 */; j++) {
            src.push(...((i % 2) != (j % 2) ? c1 : c2))
        }
    }
    // return [
    //     // rgba
    //     ...[255, 255, 255, 255], // top left
    //     ...[192, 192, 192, 255], // top right
    //     ...[192, 192, 192, 255], // bottom left
    //     ...[255, 255, 255, 255], // bottom right
    // ]
    return src
}