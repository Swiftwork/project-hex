import {
	Vector3, Vector4,
	Color4,
	VertexData,
	Mesh,
} from 'babylonjs';

export default class CustomMesh {
	public static CreateMountain(name, options: {
		base: Vector3[],
		peak: Vector3[],
		faceUV?: Vector4[],
		faceColors?: Color4[],
		sideOrientation?: number,
		updatable?: boolean
	}, scene): Mesh {
		const mountain = new Mesh(name, scene);

		var normalsSource = [
			new Vector3(0, 0, 1),
			new Vector3(0, 0, -1),
			new Vector3(1, 0, 0),
			new Vector3(-1, 0, 0),
			new Vector3(0, 1, 0),
			new Vector3(0, -1, 0)
		];

		var indices = [];
		var positions = [];
		var normals = [];
		var uvs = [];

		var width = 0.25;
		var height = 0.25;
		var depth = 0.25;
		var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || Mesh.DEFAULTSIDE;
		var faceUV: Vector4[] = options.faceUV || new Array<Vector4>(6);
		var faceColors: Color4[] = options.faceColors;
		var colors = [];

    // default face colors and UV if undefined
    for (var f = 0; f < 6; f++) {
    	if (faceUV[f] === undefined) {
    		faceUV[f] = new Vector4(0, 0, 1, 1);
    	}
    	if (faceColors && faceColors[f] === undefined) {
    		faceColors[f] = new Color4(1, 1, 1, 1);
    	}
    }

    var scaleVector = new Vector3(width / 2, height / 2, depth / 2);

    // Create each face in turn.
    for (var index = 0; index < normalsSource.length; index++) {
    	var normal = normalsSource[index];

      // Get two vectors perpendicular to the face normal and to each other.
      var side1 = new Vector3(normal.y, normal.z, normal.x);
      var side2 = Vector3.Cross(normal, side1);

      // Six indices (two triangles) per face.
      var verticesLength = positions.length / 3;
      indices.push(verticesLength);
      indices.push(verticesLength + 1);
      indices.push(verticesLength + 2);

      indices.push(verticesLength);
      indices.push(verticesLength + 2);
      indices.push(verticesLength + 3);

      // Four vertices per face.
      var vertex = normal.subtract(side1).subtract(side2).multiply(scaleVector);
      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(faceUV[index].z, faceUV[index].w);
      if (faceColors) {
      	colors.push(faceColors[index].r, faceColors[index].g, faceColors[index].b, faceColors[index].a);
      }

      vertex = normal.subtract(side1).add(side2).multiply(scaleVector);
      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(faceUV[index].x, faceUV[index].w);
      if (faceColors) {
      	colors.push(faceColors[index].r, faceColors[index].g, faceColors[index].b, faceColors[index].a);
      }

      vertex = normal.add(side1).add(side2).multiply(scaleVector);
      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(faceUV[index].x, faceUV[index].y);
      if (faceColors) {
      	colors.push(faceColors[index].r, faceColors[index].g, faceColors[index].b, faceColors[index].a);
      }

      vertex = normal.add(side1).subtract(side2).multiply(scaleVector);
      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(faceUV[index].z, faceUV[index].y);
      if (faceColors) {
      	colors.push(faceColors[index].r, faceColors[index].g, faceColors[index].b, faceColors[index].a);
      }
    }

    // sides
    CustomMesh._ComputeSides(sideOrientation, positions, indices, normals, uvs);

    // Result
    var vertexData = new VertexData();

    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    if (faceColors) {
    	var totalColors = (sideOrientation === Mesh.DOUBLESIDE) ? colors.concat(colors) : colors;
    	vertexData.colors = totalColors;
    }

		vertexData.applyToMesh(mountain, options.updatable);
		return mountain;
	}

  private static _ComputeSides(sideOrientation: number, positions: number[] | Float32Array, indices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array) {
  	var li: number = indices.length;
  	var ln: number = normals.length;
  	var i: number;
  	var n: number;
  	sideOrientation = sideOrientation || Mesh.DEFAULTSIDE;

  	switch (sideOrientation) {

  		case Mesh.FRONTSIDE:
  			// nothing changed
  			break;

  		case Mesh.BACKSIDE:
  			var tmp: number;
  			// indices
  			for (i = 0; i < li; i += 3) {
  				tmp = indices[i];
  				indices[i] = indices[i + 2];
  				indices[i + 2] = tmp;
  			}
  			// normals
  			for (n = 0; n < ln; n++) {
  				normals[n] = -normals[n];
  			}
  			break;

  		case Mesh.DOUBLESIDE:
  			// positions
  			var lp: number = positions.length;
  			var l: number = lp / 3;
  			for (var p = 0; p < lp; p++) {
  				positions[lp + p] = positions[p];
  			}
  			// indices
  			for (i = 0; i < li; i += 3) {
  				indices[i + li] = indices[i + 2] + l;
  				indices[i + 1 + li] = indices[i + 1] + l;
  				indices[i + 2 + li] = indices[i] + l;
  			}
  			// normals
  			for (n = 0; n < ln; n++) {
  				normals[ln + n] = -normals[n];
  			}

  			// uvs
  			var lu: number = uvs.length;
  			for (var u: number = 0; u < lu; u++) {
  				uvs[u + lu] = uvs[u];
  			}
  			break;
  	}
  }
}