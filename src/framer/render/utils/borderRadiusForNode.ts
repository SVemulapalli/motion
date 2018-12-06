// export function collectBorderRadiusForNode(node: WithRadius | WithRelativeRadius, style: React.CSSProperties) {
//     if (withRadiusPerCorner(node) && node.radiusPerCorner) {
//         const { radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft } = node
//         if (
//             radiusTopLeft === radiusTopRight &&
//             radiusTopLeft === radiusBottomRight &&
//             radiusTopLeft === radiusBottomLeft
//         ) {
//             if (radiusTopLeft === 0) return
//             style.borderRadius = `${radiusTopLeft}px`
//         } else {
//             style.borderRadius = `${radiusTopLeft}px ${radiusTopRight}px ${radiusBottomRight}px ${radiusBottomLeft}px`
//         }
//     } else if (withRadius(node) && node.radius !== 0) {
//         const unit = withRelativeRadius(node) && node.radiusIsRelative ? "%" : "px"
//         style.borderRadius = `${node.radius}${unit}`
//     }
// }
