import math
import random

def create_icosphere(center_x, center_y, center_z, radius, subdivisions=1):
    phi = (1.0 + math.sqrt(5.0)) / 2.0
    vertices = [
        [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
        [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
        [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ]
    # Normalize
    for i in range(12):
        l = math.sqrt(sum(v**2 for v in vertices[i]))
        vertices[i] = [v/l for v in vertices[i]]
    
    faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ]

    for _ in range(subdivisions):
        new_faces = []
        midpoint_cache = {}
        def get_midpoint(v1, v2):
            key = tuple(sorted([v1, v2]))
            if key in midpoint_cache: return midpoint_cache[key]
            l1, l2 = vertices[v1], vertices[v2]
            pm = [(l1[0]+l2[0])/2.0, (l1[1]+l2[1])/2.0, (l1[2]+l2[2])/2.0]
            length = math.sqrt(sum(v**2 for v in pm))
            pm = [p/length for p in pm]
            idx = len(vertices)
            vertices.append(pm)
            midpoint_cache[key] = idx
            return idx

        for f in faces:
            v1, v2, v3 = f
            a = get_midpoint(v1, v2)
            b = get_midpoint(v2, v3)
            c = get_midpoint(v3, v1)
            new_faces.extend([[v1, a, c], [v2, b, a], [v3, c, b], [a, b, c]])
        faces = new_faces
    
    # Apply slightly perturbed radius and translate
    final_verts = []
    for v in vertices:
        r = radius * random.uniform(0.95, 1.05)
        final_verts.append([
            v[0]*r + center_x,
            v[1]*r + center_y,
            v[2]*r + center_z
        ])
    return final_verts, faces

def merge(meshes):
    all_v = []
    all_f = []
    offset = 1
    for (verts, faces) in meshes:
        all_v.extend(verts)
        for f in faces:
            all_f.append([idx + offset for idx in f])
        offset += len(verts)
    return all_v, all_f

def main():
    random.seed(42)  # For consistent output
    meshes = []
    # Assemble a cloud from intersecting primitives
    meshes.append(create_icosphere(0, 0, 0, 1.0, 1))           # Main center
    meshes.append(create_icosphere(-0.9, -0.2, 0.2, 0.7, 1))   # Left
    meshes.append(create_icosphere(0.9, -0.1, -0.1, 0.6, 1))   # Right
    meshes.append(create_icosphere(0.4, 0.7, 0.3, 0.6, 1))     # Top right
    meshes.append(create_icosphere(-0.4, 0.6, -0.2, 0.5, 1))   # Top left
    meshes.append(create_icosphere(0.2, -0.5, 0.4, 0.4, 0))    # Front bottom
    meshes.append(create_icosphere(-0.1, 0.3, -0.8, 0.5, 0))   # Back

    v, f = merge(meshes)

    with open("cloud.obj", "w") as out:
        out.write("# Low Poly Cloud OBJ\n")
        out.write(f"o Cloud\n")
        for vert in v:
            out.write(f"v {vert[0]:.4f} {vert[1]:.4f} {vert[2]:.4f}\n")
        for face in f:
            out.write(f"f {face[0]} {face[1]} {face[2]}\n")
            
if __name__ == '__main__':
    main()
