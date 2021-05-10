import { CustomHoverEvents } from "src/types";
import * as THREE from "three";

/**
 * Check the hover state on threejs objects: mouseover, mouseleave, and two extra
 * state: inside, outside.
 *
 * Can also return the hoveredObjects
 *
 * Initiate the MouseEventsMonitor object and then call
 * getAllHoveredData() when needed
 */
export class HoverEventsMonitor {
  private hoverState: CustomHoverEvents;
  private raycaster: THREE.Raycaster;
  private objectsToCheck: THREE.Object3D[];
  private hoveredObjects: THREE.Intersection[];
  private mouseCoordinate: THREE.Vector2;
  private camera: THREE.PerspectiveCamera;

  constructor(
    initialHoverState: CustomHoverEvents,
    objectsToCheck: THREE.Object3D[],
    camera: THREE.PerspectiveCamera,
    checkImmediately?: boolean,
    normalizedMouseCoordinate?: THREE.Vector2
  ) {
    this.hoverState = initialHoverState;
    this.objectsToCheck = objectsToCheck;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();

    if (checkImmediately) {
      if (normalizedMouseCoordinate) {
        this.mouseCoordinate = normalizedMouseCoordinate;
        this.checkHoverEvents(this.mouseCoordinate);
        this.raycaster.setFromCamera(this.mouseCoordinate, this.camera);
      } else {
        throw new Error(
          "To check immediately, normalizedMouseCoordinate and camera must be passed in on instantiation"
        );
      }
    }
  }

  checkHoverEvents(normalizedMouseCoordinate: THREE.Vector2): void {
    this.mouseCoordinate = normalizedMouseCoordinate;
    this.raycaster.setFromCamera(this.mouseCoordinate, this.camera);
    const intersecteds = this.raycaster.intersectObjects(this.objectsToCheck);

    if (intersecteds.length) {
      if (this.hoverState === "outside") {
        this.hoverState = "mouseenter";
      } else {
        this.hoverState = "inside";
      }
      this.hoveredObjects = intersecteds;
    } else {
      if (this.hoverState === "inside") {
        this.hoverState = "mouseleave";
      } else {
        this.hoverState = "outside";
      }
      this.hoveredObjects = [];
    }
  }

  getAllObjects(): THREE.Object3D[] {
    return this.objectsToCheck;
  }

  getHoveredObjects(): THREE.Intersection[] {
    return this.hoveredObjects;
  }

  getHoverState(): CustomHoverEvents {
    return this.hoverState;
  }

  /**
   * monitor hovered events and returns both hoveredObjects and hoveredState
   */
  getAllHoverData() {
    return {
      hoverState: this.getHoverState(),
      hoveredObjects: this.getHoveredObjects(),
      allCheckedObjects: this.getAllObjects(),
    };
  }
}