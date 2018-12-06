// import * as _ from "lodash";
import { Point } from "../render"

/**
 * Create a new point from a point, single number, or nothing.
 * @param input a point, single number, or nothing
 */
// export const make = (input?: number | Point): Point => {

// 	if (_.isNumber(input)) { return zero(input) }
// 	if (!input) { return zero() }

// 	let result = zero()

// 	for (let k of ["x", "y"]) {
// 		if (_.isNumber(input[k])) { result[k] = input[k] }
// 	}

// 	return result
// }

/**
 * Set the x and y of a point to zero or any other number,
 * @param n optional zero number.
 */
export const zero = (n = 0): Point => {
    return { x: n, y: n }
}

/**
 * Divide a point by a number.
 * @param point the point to divide.
 * @param fraction the fration to divide by.
 */
export const divide = (point: Point, fraction: number): Point => {
    return {
        x: point.x / fraction,
        y: point.y / fraction,
    }
}

/**
 * Add two points.
 * @param pointA
 * @param pointB
 */
export const add = (pointA: Point, pointB: Point): Point => {
    return {
        x: pointA.x + pointB.x,
        y: pointA.y + pointB.y,
    }
}

/**
 * Subtract two points.
 * @param pointA
 * @param pointB
 */
export const subtract = (pointA: Point, pointB: Point): Point => {
    return {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y,
    }
}

// /**
//  * Get the minimum x and y values from a range of points.
//  * @param points
//  */
// export const min = (...points: Point[]): Point => {
// 	return {
// 		x: _.min(points.map(size => size.x)),
// 		y: _.min(points.map(size => size.y))
// 	}
// }

// /**
//  * Get the maximum x and y values from a range of points.
//  * @param points
//  */
// export const max = (...points: Point[]): Point => {
// 	return {
// 		x: _.max(points.map(size => size.x)),
// 		y: _.max(points.map(size => size.y))
// 	}
// }

/**
 * Get the offset between two points.
 * @param pointA
 * @param pointB
 */
export const offset = (pointA: Point, pointB: Point): Point => {
    return {
        x: pointB.x - pointA.x,
        y: pointB.y - pointA.y,
    }
}

/**
 * Get the total distance from a line between two points.
 * @param pointA
 * @param pointB
 */
export const distance = (pointA: Point, pointB: Point): number => {
    const a = pointA.x - pointB.x
    const b = pointA.y - pointB.y
    return Math.sqrt(a * a + b * b)
}

/**
 * Get the inverted x an y values.
 * @param point
 */
export const invert = (point: Point): Point => {
    return {
        x: 0 - point.x,
        y: 0 - point.y,
    }
}

/**
 * Get the x and y values added up.
 * @param point
 */
export const total = (point: Point): number => {
    return point.x + point.y
}

/**
 * Get the absolute x and y values.
 * @param point
 */
export const abs = (point: Point): Point => {
    return {
        x: Math.abs(point.x),
        y: Math.abs(point.y),
    }
}

// /**
//  * See if a point is in a frame.
//  * @param point
//  * @param frame
//  */
// export const inFrame = (point: Point, frame: Types.Frame): boolean => {
//   if (point.x < Utils.frame.getMinX(frame) || point.x > Utils.frame.getMaxX(frame)) {
//     return false;
//   }
//   if (point.y < Utils.frame.getMinY(frame) || point.y > Utils.frame.getMaxY(frame)) {
//     return false;
//   }
//   return true;
// };

// /**
//  * Get the center between two points.
//  * @param pointA
//  * @param pointB
//  */
// export const center = (pointA: Point, pointB: Point): Point => {
//   return {
//     x: (pointA.x + pointB.x) / 2,
//     y: (pointA.y + pointB.y) / 2
//   };
// };

// /**
//  * Get the angle in degrees between two points.
//  * @param pointA
//  * @param pointB
//  */
// export const angle = (pointA: Point, pointB: Point): Types.Degrees => {
//   return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI;
// };

// export const direction = (offset: Point) => {
//   if (Math.abs(offset.x) > Math.abs(offset.y)) {
//     if (offset.x > 0) {
//       return "right";
//     }
//     if (offset.x < 0) {
//       return "left";
//     }
//   }
//   if (Math.abs(offset.x) < Math.abs(offset.y)) {
//     if (offset.y < 0) {
//       return "up";
//     }
//     if (offset.y > 0) {
//       return "down";
//     }
//   }
//   return null;
// };
