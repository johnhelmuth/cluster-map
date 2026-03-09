import type {PointType} from "~/utils/geometry";

export type BezierCubicLineType = [
  PointType,
  PointType,
  PointType,
  PointType
];

export type LineType = [
  PointType,
  PointType
]

/**
 * Computes intersection between a cubic spline and a line segment.
 *
 * From the article "Computing Intersections Between a Cubic Bezier Curve and a Line"
 * at https://www.particleincell.com/2013/cubic-line-intersection/
 *
 * Converted it to Typescript tweaked the parameters and response to match the types this project uses,
 * and removed the SVG manipulating parts.
 */

export function intersectBezierLine(b: BezierCubicLineType, l: LineType): PointType[] {

  const X = [];
  
  const A = l[1].y - l[0].y;             // A = y2 - y1
  const B = l[0].x - l[1].x;             // B = x1 - x2
  const C = l[0].x * (l[0].y - l[1].y) +
                    l[0].y * (l[1].x - l[0].x);  // C = x1 * (y1 - y2) + y1 * (x2 - x1)
  
  const bx = bezierCoeffs(b[0].x, b[1].x, b[2].x, b[3].x);
  const by = bezierCoeffs(b[0].y, b[1].y, b[2].y, b[3].y);
  
  const P = [
    A*bx[0]+B*by[0],		  /*t^3*/
    A*bx[1]+B*by[1],		  /*t^2*/
    A*bx[2]+B*by[2],		  /*t*/
    A*bx[3]+B*by[3] + C  	/*1*/
  ] as [number, number, number, number];
  
  const r = cubicRoots(P);

  const intersects = [] as PointType[];

  /*verify the roots are in bounds of the linear segment*/
  for (let i = 0; i < r.length; i++) {
    const t = r[i];
    if (typeof t !== 'undefined') {
      X[0] = bx[0]*t*t*t+bx[1]*t*t+bx[2]*t+bx[3];
      X[1] = by[0]*t*t*t+by[1]*t*t+by[2]*t+by[3];

      /*above is intersection point assuming infinitely long line segment,
        make sure we are also in bounds of the line*/
      let s;
      if ((l[1].x-l[0].x)!=0) {         /*if not vertical line*/
        s = (X[0] - l[0].x) / (l[1].x - l[0].x);
      } else {
        s = (X[1] - l[0].y) / (l[1].y - l[0].y);
      }

      /*in bounds?*/
      if (! (t<0 || t>1.0 || s<0 || s>1.0)) {
        intersects.push({ x: X[0], y: X[1] });
      }
    }
  }
  return intersects;
}

/*based on http://mysite.verizon.net/res148h4j/javascript/script_exact_cubic.html#the%20source%20code*/
function cubicRoots(P: [number,number,number,number]) {

  const a= P[0];
  const b= P[1];
  const c= P[2];
  const d= P[3];

  const A= b/a;
  const B= c/a;
  const C= d/a;

  const Q = (3*B - Math.pow(A, 2))/9;
  const R = (9*A*B - 27*C - 2*Math.pow(A, 3))/54;
  const D = Math.pow(Q, 3) + Math.pow(R, 2);    // polynomial discriminant

  const t= [] as number[];

  if (D >= 0) {                               // complex or duplicate roots

    const S = sgn(R + Math.sqrt(D))*Math.pow(Math.abs(R + Math.sqrt(D)),(1/3));
    const T = sgn(R - Math.sqrt(D))*Math.pow(Math.abs(R - Math.sqrt(D)),(1/3));

    t[0] = -A/3 + (S + T);                    // real root
    t[1] = -A/3 - (S + T)/2;                  // real part of complex root
    t[2] = -A/3 - (S + T)/2;                  // real part of complex root
    const Im = Math.abs(Math.sqrt(3)*(S - T)/2);    // complex part of root pair

    /*discard complex roots*/
    if (Im != 0) {
      t[1] = -1;
      t[2] = -1;
    }

  } else {                                        // distinct real roots

    const th = Math.acos(R/Math.sqrt(-Math.pow(Q, 3)));

    t[0] = 2*Math.sqrt(-Q)*Math.cos(th/3) - A/3;
    t[1] = 2*Math.sqrt(-Q)*Math.cos((th + 2*Math.PI)/3) - A/3;
    t[2] = 2*Math.sqrt(-Q)*Math.cos((th + 4*Math.PI)/3) - A/3;
  }

  const filteredSortedt = t
    .filter((tval) => !(tval < 0 || tval > 1.0))
    .sort((ta, tb) => (ta - tb));
  console.log('cubicRoots() filteredSortedt: ', filteredSortedt);
  return filteredSortedt;
}

function bezierCoeffs(P0: number, P1: number, P2: number, P3: number): [number, number, number, number] {

  return [
    -P0 + 3*P1 + -3*P2 + P3,
    3*P0 - 6*P1 + 3*P2,
    -3*P0 + 3*P1,
    P0
  ]

}

function sgn( x: number ) {
  if (x < 0.0) {
    return -1;
  }
  return 1;
}