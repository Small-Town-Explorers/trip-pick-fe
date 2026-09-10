/** Values crossing the WebView boundary are JSON, never executable source or HTML. */
export function serializeMapData(value: unknown) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw new Error('지도에 전달할 데이터가 없어요.');
  return serialized
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function createMapDocument(javascriptKey: string) {
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>html,body,#map{width:100%;height:100%;margin:0;overflow:hidden}#status{position:absolute;inset:0;display:grid;place-items:center;background:#f5f5f5;color:#666;text-align:center;padding:16px;font:14px sans-serif;z-index:10}</style>
</head><body><div id="map" aria-label="카카오 지도"></div><div id="status" role="status">지도를 불러오는 중이에요.</div>
<script>
(function(){
  var maps, map, geocoder, marker, overlays=[], lines=[], sequence=0, lastSearch=null, lastCenter='', selectedKey='',regionSignature='';
  var status=document.getElementById('status');
  var current={mode:'route',coordinates:[]};
  var ready=false, failed=false;
  function send(value){window.ReactNativeWebView.postMessage(JSON.stringify(value));}
  function message(text){status.textContent=text;status.style.display=text?'grid':'none';}
  function fail(){if(failed)return;failed=true;clearTimeout(timer);send({type:'error',message:'지도를 불러오지 못했어요. 네트워크 연결이나 지도 설정을 확인해 주세요.'});}
  var timer=setTimeout(fail,15000);
  function valid(p){return p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;}
  function point(p){return new maps.LatLng(p.lat,p.lng);}
  function color(day){return day%2===0?'#155744':'#349653';}
  function clearRoute(){overlays.forEach(function(o){o.setMap(null);});lines.forEach(function(l){l.setMap(null);});overlays=[];lines=[];}
  function select(p){var position=point(p);if(marker)marker.setPosition(position);else marker=new maps.Marker({map:map,position:position});map.setCenter(position);selectedKey=p.lat+','+p.lng;}
  function loading(value){send({type:'loading',value:value});}
  function locationError(text){send({type:'locationError',message:text});}
  function renderRoute(days){
    clearRoute();var places=[],order=0;
    days.forEach(function(day,dayIndex){day.forEach(function(p){order++;if(valid(p))places.push({lat:p.lat,lng:p.lng,day:dayIndex,order:order});});});
    if(!places.length){message('표시할 장소가 없습니다.');return;}
    message('');var bounds=new maps.LatLngBounds();
    places.forEach(function(p,i){
      var position=point(p);bounds.extend(position);
      var label=document.createElement('div');label.textContent=String(p.order);
      label.setAttribute('aria-label',(p.day+1)+'일차 '+p.order+'번째 장소');
      label.style.cssText='width:26px;height:30px;border-radius:14px 14px 14px 0;display:grid;place-items:center;color:white;font:bold 13px sans-serif;background:'+color(p.day)+';';
      overlays.push(new maps.CustomOverlay({map:map,position:position,content:label,yAnchor:1,zIndex:1}));
      if(i>0)lines.push(new maps.Polyline({map:map,path:[point(places[i-1]),position],strokeWeight:2,strokeColor:color(places[i-1].day),strokeOpacity:0.9,strokeStyle:'shortdot'}));
    });
    map.relayout();
    if(places.some(function(p){return p.lat!==places[0].lat||p.lng!==places[0].lng;}))map.setBounds(bounds,40,40,40,40);
    else {map.setCenter(point(places[0]));map.setLevel(3);}
  }
  function renderRegions(regions,selectedId){
    clearRoute();var validRegions=(regions||[]).filter(valid);
    if(!validRegions.length){message('표시할 방문 지역이 없습니다.');return;}
    message('');var nextSignature=validRegions.map(function(region){return region.id+':'+region.lat+','+region.lng;}).join('|');
    validRegions.forEach(function(region){
      var position=point(region);
      var label=document.createElement('button');var selected=region.id===selectedId;
      label.type='button';label.textContent=region.label;
      label.setAttribute('aria-label',region.label+' 여행 코스 보기');
      label.setAttribute('aria-pressed',String(selected));
      label.style.cssText='border:0;border-radius:9999px;padding:7px 12px;white-space:nowrap;color:white;font:600 13px/1.2 sans-serif;background:'+(selected?'#155744':'#349653')+';box-shadow:0 3px 10px rgba(8,25,29,.22);';
      label.onclick=function(){send({type:'regionPress',id:region.id});};
      overlays.push(new maps.CustomOverlay({map:map,position:position,content:label,xAnchor:.5,yAnchor:1,zIndex:selected?2:1}));
    });
    map.relayout();
    if(nextSignature!==regionSignature){
      var bounds=new maps.LatLngBounds(),latSum=0,lngSum=0;
      validRegions.forEach(function(region){bounds.extend(point(region));latSum+=region.lat;lngSum+=region.lng;});
      if(validRegions.length>1)map.setBounds(bounds,48,48,48,48);else map.setLevel(8);
      map.setCenter(new maps.LatLng(latSum/validRegions.length,lngSum/validRegions.length));regionSignature=nextSignature;
    }
  }
  function searchAddress(request){
    if(!request||!request.address.trim()||lastSearch===request.requestId)return;
    lastSearch=request.requestId;var id=++sequence;loading(true);locationError('');
    geocoder.addressSearch(request.address,function(results,resultStatus){
      if(id!==sequence)return;loading(false);
      var first=results[0];
      if(resultStatus!==maps.services.Status.OK||!first){locationError('입력한 주소를 찾지 못했어요. 주소를 다시 확인해 주세요.');return;}
      var location={lat:Number(first.y),lng:Number(first.x),address:first.address_name||request.address};
      if(!valid(location)){locationError('주소의 좌표를 확인하지 못했어요.');return;}
      select(location);map.setLevel(3);send({type:'location',location:location});
    });
  }
  window.updateMap=function(value){
    current=value;if(!ready)return;
    try{
      if(value.mode==='route'){renderRoute(value.coordinates||[]);return;}
      if(value.mode==='regions'){renderRegions(value.markers||[],value.selectedId);return;}
      message('');
      if(valid(value.selectedCoordinate)&&selectedKey!==value.selectedCoordinate.lat+','+value.selectedCoordinate.lng){select(value.selectedCoordinate);map.setLevel(3);}
      if(!value.selectedCoordinate&&selectedKey){if(marker)marker.setMap(null);marker=null;selectedKey='';}
      if(value.initialCenterAddress&&lastCenter!==value.initialCenterAddress){
        lastCenter=value.initialCenterAddress;
        if(!valid(value.selectedCoordinate)&&!value.addressSearchRequest){
          var id=++sequence;geocoder.addressSearch(lastCenter,function(results,resultStatus){
            if(id!==sequence||selectedKey||resultStatus!==maps.services.Status.OK||!results[0])return;
            map.setCenter(new maps.LatLng(Number(results[0].y),Number(results[0].x)));map.setLevel(8);
          });
        }
      }
      searchAddress(value.addressSearchRequest);
    }catch(e){fail();}
  };
  var sdk=document.createElement('script');
  sdk.src='https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&libraries=services&appkey='+encodeURIComponent(${serializeMapData(javascriptKey)});
  sdk.onerror=fail;
  sdk.onload=function(){
    if(failed)return;
    if(!window.kakao||!window.kakao.maps){fail();return;}
    window.kakao.maps.load(function(){
      if(failed)return;
      try{
        maps=window.kakao.maps;geocoder=new maps.services.Geocoder();
        map=new maps.Map(document.getElementById('map'),{center:new maps.LatLng(36.5,127.8),level:12});
        map.setCopyrightPosition(maps.CopyrightPosition.BOTTOMRIGHT,true);
        maps.event.addListener(map,'click',function(event){
          if(current.mode!=='picker'||!current.canSelect)return;
          var id=++sequence;var location={lat:event.latLng.getLat(),lng:event.latLng.getLng()};
          select(location);loading(true);locationError('');
          geocoder.coord2Address(location.lng,location.lat,function(results,resultStatus){
            if(id!==sequence)return;loading(false);var first=results[0];
            var address=first&&(first.road_address&&first.road_address.address_name||first.address&&first.address.address_name);
            if(resultStatus!==maps.services.Status.OK||!address){locationError('주소를 확인하지 못했어요. 다른 위치를 선택해 주세요.');return;}
            location.address=address;send({type:'location',location:location});
          });
        });
        window.addEventListener('resize',function(){map.relayout();if(current.mode==='route')renderRoute(current.coordinates||[]);if(current.mode==='regions')renderRegions(current.markers||[],current.selectedId);});
        ready=true;clearTimeout(timer);message('');send({type:'ready'});
      }catch(e){fail();}
    });
  };
  document.head.appendChild(sdk);
})();
</script></body></html>`;
}
