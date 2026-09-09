# The fivefold symmetry study

A two-sided, colored wire sculpture moves automatically through ten symmetry
poses. The colors identify material lobes. There are no transformation buttons
or cursor actions. A small pause control and reduced-motion support let visitors
keep it still. Animation pauses offscreen and in hidden tabs.

## Shape and group

For 0 <= t <= 1 and side ε in {-1, +1}, define

    q(t, θ) = 122t (1 + 0.18 cos(5θ))
    h(t, θ) = 38(1 - t²) + 20 sin(πt) cos(5θ)
    Fε(t, θ) = (q sin θ, -q cos θ, εh)

The two sheets meet at t=1 and form a closed shell. The relevant symmetry group
is the proper rotational D5 subgroup in three dimensions. Its generators are

    r: rotation by 2π/5 about z
    s: rotation by π about y, (x,y,z) -> (-x,y,-z)

Because cos(5(θ + 2π/5)) = cos(5θ) and cos(-5θ) = cos(5θ),

    r Fε(t,θ) = Fε(t,θ + 2π/5)
    s Fε(t,θ) = F-ε(t,-θ)

Both operations preserve the full shell as a set. The group has ten elements:
five rotations about z (including identity) and five half-turns about axes in
the equatorial plane. On that plane, s acts as a reflection. In 3D it is a
proper rotation with determinant +1, not a mirror reflection with determinant
-1. The uncolored shell also admits improper symmetries; D5 here specifically
names its proper rotational subgroup. Colors are tracking annotations and are
not claimed to be preserved by every symmetry.

## Exact state and continuous motion

Every settled pose is stored as r^k s^b, with integer k modulo five and Boolean b.
Composition and lobe permutations use exact integer arithmetic:

    (r^k s^b)(r^j s^c) = r^(k + (-1)^b j) s^(b+c mod 2)
    i -> k + (-1)^b i (mod 5)

Thus r^5=e, s^2=e, and srs=r^-1. The automatic sequence is four r moves and one
s move, repeated twice. It visits all ten group elements and returns to e.

Between settled poses the renderer applies Rz(α) or Ry(β) to the starting pose,
with α from 0 to 2π/5 or β from 0 to π. Every intermediate matrix is orthogonal
with determinant +1. Distances and the shape are preserved throughout. The
intermediate orientations are transitions between symmetry poses, not additional
elements of D5. Smooth easing changes speed only, never geometry.

This is why the form now has two sides. Turning over the old one-sided dome
would not have mapped it onto itself. The earlier deformation
(x cos φ, y, z + 0.55 x sin φ) was not rigid and is no longer used.

## Rendering and precision

Both sides use the same five material colors. Sampled contour arcs are projected
through a fixed orthographic camera and drawn from farther to nearer, with lower
opacity on distant curves. This is an intentionally translucent wire rendering;
it does not claim physically opaque occlusion. The static SVG uses the same
geometry, palette, projection, and identity pose as the canvas.

Analytic symmetry identities, group states, and permutations are exact.
Coordinates, trigonometric evaluation, curve sampling, and rasterization use
ordinary finite precision. Tests supplement the derivation by checking group
composition, shell invariance, all animation frames sampled at 101 points per
move per state, and the complete automatic cycle.

Concept reference: [3Blue1Brown, Euler's formula with introductory group theory](https://www.3blue1brown.com/lessons/eulers-formula-via-group-theory/)
explains rotations and turning over a symmetric object. The portfolio's short
caption keeps its existing [group theory lesson link](https://www.3blue1brown.com/lessons/groups-and-monsters/).

    node --test src/scripts/line-geometry.test.js
