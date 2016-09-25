import {
  Vector3,
  Mesh,
  CSG,
  Scene,
} from 'babylonjs';

export default class CustomMeshes {

  static ALIGNMENT = {
    INSIDE: 0,
    CENTER: 1,
    OUTSIDE: 2,
  };
  
  /*
  static CreateFrame2(name: string, options: {
    mesh: Mesh,
    height: number,
    thickness?: number,
    alignment?: number,
  }, scene: Scene): Mesh {
    const outerMesh = options.mesh.clone('outer');
    const innerMesh = options.mesh.clone('inner');
    outerMesh.getBoundingInfo().boundingBox.maximumWorld;

    switch (options.alignment) {
      case CustomMeshes.ALIGNMENT.OUTSIDE:
        outerMesh.scaling.scaleInPlace(1 + (options.thickness / options.length) * 2);
        break;

      case CustomMeshes.ALIGNMENT.CENTER:
        outerMesh.scaling.scaleInPlace(1 + (options.thickness / options.length));
        innerMesh.scaling.scaleInPlace(1 - (options.thickness / options.length));
        break;

      case CustomMeshes.ALIGNMENT.INSIDE:
      default:
        innerMesh.scaling.scaleInPlace(1 - (options.thickness / options.length) * 2);
        break;
    }

    outerMesh.scaling.y = innerMesh.scaling.y = options.height / options.length;

    const frame = CSG.FromMesh(outerMesh).subtract(CSG.FromMesh(innerMesh)).toMesh(name, null, scene, false);
    outerMesh.dispose();
    innerMesh.dispose();
    return frame;
  }
  */

  static CreateFrame(name: string, options: {
    length: number,
    depth: number,
    height: number,
    thickness?: number,
    alignment?: number,
  }, scene: Scene): Mesh {
    const outerMesh = Mesh.CreateBox("outer", options.length, scene, false);
    const innerMesh = Mesh.CreateBox("inner", options.length, scene, false);
    outerMesh.scaling = new Vector3(1, 1, options.length / options.depth);
    innerMesh.scaling = new Vector3(1, 1, options.length / options.depth);

    switch (options.alignment) {
      case CustomMeshes.ALIGNMENT.OUTSIDE:
        outerMesh.scaling.scaleInPlace(1 + (options.thickness / options.length) * 2);
        break;

      case CustomMeshes.ALIGNMENT.CENTER:
        outerMesh.scaling.scaleInPlace(1 + (options.thickness / options.length));
        innerMesh.scaling.scaleInPlace(1 - (options.thickness / options.length));
        break;

      case CustomMeshes.ALIGNMENT.INSIDE:
      default:
        innerMesh.scaling.scaleInPlace(1 - (options.thickness / options.length) * 2);
        break;
    }

    outerMesh.scaling.y = innerMesh.scaling.y = options.height / options.length;

    const frame = CSG.FromMesh(outerMesh).subtract(CSG.FromMesh(innerMesh)).toMesh(name, null, scene, false);
    outerMesh.dispose();
    innerMesh.dispose();
    return frame;
  }

  static CreateFrame3(name: string, options: {
    shape: Vector3[],
    height: number,
    thickness?: number,
    alignment?: number,
  }, scene: Scene): Mesh {

    let inner = options.shape.slice(0);
    let outer = options.shape.slice(0);

    switch (options.alignment) {
      case CustomMeshes.ALIGNMENT.OUTSIDE:
        for (let i = 0; i < outer.length; i++)
          outer[i] = CustomMeshes.VectorExpand(outer[i], options.thickness);
        break;

      case CustomMeshes.ALIGNMENT.CENTER:
        for (let i = 0; i < outer.length; i++)
          outer[i] = CustomMeshes.VectorExpand(outer[i], options.thickness / 2);
        for (let i = 0; i < inner.length; i++)
          inner[i] = CustomMeshes.VectorContract(inner[i], options.thickness / 2);
        break;

      case CustomMeshes.ALIGNMENT.INSIDE:
      default:
        for (let i = 0; i < inner.length; i++)
          inner[i] = CustomMeshes.VectorContract(inner[i], options.thickness);
        break;
    }

    const extrusion = [
      Vector3.Zero(),
      new Vector3(0, options.height, 0),
    ];
      
    const outerMesh = Mesh.ExtrudeShape("outer", outer, extrusion, 1, 0, 3, scene);
    const innerMesh = Mesh.ExtrudeShape("inner", inner, extrusion, 1, 0, 3, scene);
    const frame = CSG.FromMesh(innerMesh).subtract(CSG.FromMesh(outerMesh)).toMesh(name, null, scene, false);
    outerMesh.dispose();
    innerMesh.dispose();
    return frame;
  }

  static VectorExpand(vector: Vector3, amount: number): Vector3 {
    return new Vector3(
      vector.x === 0 ? vector.x : vector.x > 0 ? vector.x + amount : vector.x - amount,
      vector.y === 0 ? vector.y : vector.y > 0 ? vector.y + amount : vector.y - amount,
      vector.z === 0 ? vector.z : vector.z > 0 ? vector.z + amount : vector.z - amount
    );
  }

  static VectorContract(vector: Vector3, amount: number): Vector3 {
    return new Vector3(
      vector.x === 0 ? vector.x : vector.x > 0 ? vector.x - amount : vector.x + amount,
      vector.y === 0 ? vector.y : vector.y > 0 ? vector.y - amount : vector.y + amount,
      vector.z === 0 ? vector.z : vector.z > 0 ? vector.z - amount : vector.z + amount
    );
  }
}