import Spline from "@splinetool/react-spline";

export default function ProductStoryVisual() {
  return (
    <div className="h-full w-full py-10">
      <div className="h-full overflow-hidden rounded-[32px] border border-white/10 bg-black/20">
        <Spline scene="https://prod.spline.design/HhRIrjbasNVOfV18/scene.splinecode" />
      </div>
    </div>
  );
}