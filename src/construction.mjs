// Geometric checks read the rendered model's triangles in world space, not
// hard-coded duplicate dimensions. Used from the isolated browser QA session.
function inspectBadges(T, g, mounts) {
  g.updateMatrixWorld(true);
  const solids=[];
  g.traverse(n=>{if(n.isMesh&&!n.userData.brandDecal&&n.visible)solids.push(n);});
  const ray=new T.Raycaster(), forward=new T.Vector3(), point=new T.Vector3(), end=new T.Vector3();
  return mounts.map(mark=>{
    forward.set(0,0,1).transformDirection(mark.matrixWorld);
    const back=forward.clone().negate(), gaps=[], poses=[];
    let coverage=0,total=0,surface=null,blocked=0;
    // Test points lie in triangles of the actual two-part logo. Ignore the
    // notch between the shapes and use points away from polygon edges.
    for(const part of mark.children){
      const v=part.geometry.attributes.position, candidates=[];
      for(let i=0;i<v.count;i+=3){
        const ax=v.getX(i),ay=v.getY(i), bx=v.getX(i+1),by=v.getY(i+1),cx=v.getX(i+2),cy=v.getY(i+2);
        const area=Math.abs((bx-ax)*(cy-ay)-(cx-ax)*(by-ay));
        if(area>1e-7)candidates.push({area,x:(ax+bx+cx)/3,y:(ay+by+cy)/3});
      }
      candidates.sort((a,b)=>b.area-a.area);
      for(const {x,y} of candidates.slice(0,9)){
        point.set(x,y,0).applyMatrix4(mark.matrixWorld);
        ray.set(end.copy(point).addScaledVector(forward,.12),back);ray.far=.26;
        const nearest=ray.intersectObjects(solids,false)[0];total++;
        if(nearest){const gap=nearest.distance-.12;gaps.push(gap);if(Math.abs(gap)<.006){coverage++;surface??=nearest.object;}if(gap<-.006)blocked++;}
      }
    }
    if(surface){surface.geometry.computeBoundingBox();const center=surface.geometry.boundingBox.getCenter(new T.Vector3());const local=surface.worldToLocal(mark.getWorldPosition(new T.Vector3()));poses.push(Math.round(1000*(local.x-center.x))/1000,Math.round(1000*(local.y-center.y))/1000,Math.round(1000*(local.z-center.z))/1000);}
    return {tested:total,seated:coverage,blocked,nearest:gaps.length?Number(Math.min(...gaps).toFixed(4)):null,farthest:gaps.length?Number(Math.max(...gaps).toFixed(4)):null,hostOffset:poses};
  });
}
