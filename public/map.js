$(document).ready(function(){

  var map_markers = [];
  var map ;
  var reg_marker;
  var resultData = [];
  
  {
    // test
    $('#inputName').val('스타벅스');
    $('#inputTags').val('커피 음료');
    $('#inputDesc').val('2층 복잡함');
    fnRandomSearch();
    mapInit('map');


    Vue.component('my-title', {
      template: '<div>{{webtitle}}</div>',
      data : {
        tabledata : resultData
      },
      /*function*/
    });

    let app = new Vue({
      el: '#vue',
      data: {
        title: 'Hello Map'
      }
    })

  }


  {
    $('#btnSearch').on('click', function(e){

      clearMarker();

      $.ajax({
        url: '/api/lunch_menu/',
        data: {},
        method: 'get', 
        error: function(xhr, status, error){
          console.log(status);
        },
        success: function(data, status, xhr) {
          console.log(data);
          console.log(status);

          let html ='';
          resultData = data.data;
          $.each(data.data, function(idx, item){
            html += '<tr><td>'+(idx+1)+'</td><td>'+item.name+'</td><td><i class="fas fa-award"></i><i class="far fa-thumbs-up"></i><i class="far fa-thumbs-down"></i>'+item.id+'</td></tr>';
      
            // 마커가 표시될 위치입니다 
            var markerPosition = new kakao.maps.LatLng(item.lat, item.lng); 

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                position: markerPosition
            });

            addMarker(marker);
          });
          $('#resultTable tbody').html(html); 
        }
      })
    });

    $('#btnRSearch').on('click', function(e){
      fnRandomSearch();
    });

    $('#btnAdd').on('click', function(){
      $('#inputName').val('').focus();
      $('#inputTags').val('');
      $('#inputDesc').val('');
      $('#f').show();

    });

    $('#btnSave').on('click', function(e){
      
      let params = $('#f').serialize();

      $.ajax({
        url: '/api/lunch_menu/',
        data: params,
        method: 'post', 
        error: function(xhr, status, error){
          console.log(status);
        },
        success: function(data, status, xhr) {
          console.log(data);
          console.log(status);
        }
      });
      return false;
    });
  }

  function fnRandomSearch(){
    clearMarker();
    $.ajax({
      url: '/api/lunch_menu/ramdom',
      data: {},
      method: 'get', 
      error: function(xhr, status, error){
        console.log(status);
      },
      success: function(data, status, xhr) {
        console.log(data);
        console.log(status);

        let html ='';
        
        $.each(data.data, function(idx, item){
          html += '<tr><td>'+(idx+1)+'</td><td>'+item.name+'</td><td><i class="fas fa-award"></i><i class="far fa-thumbs-up"></i><i class="far fa-thumbs-down"></i>'+item.id+'</td></tr>';

          // 마커가 표시될 위치입니다 
          var markerPosition = new kakao.maps.LatLng(item.lat, item.lng); 

          // 마커를 생성합니다
          var marker = new kakao.maps.Marker({
              position: markerPosition
          });

          addMarker(marker);

        });
        $('#resultTable tbody').html(html); 
      }
    })
  }

  function addMarker(marker) {
    marker.setMap(map);
    map_markers.push(marker);
  }

  function clearMarker() {
    for(var _m in map_markers) {
      map_markers.forEach(function( _m, idx) {
        _m.setMap(null);
      });
      map_markers = [];
    }
  }


  function mapInit(mapId){
    var container = document.getElementById(mapId); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        //center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        center: new kakao.maps.LatLng(37.489111, 127.007998),
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
  
    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
  
    // 지도를 클릭한 위치에 표출할 마커입니다
    reg_marker = new kakao.maps.Marker({ 
      // 지도 중심좌표에 마커를 생성합니다 
      position: map.getCenter() 
    }); 
    // 지도에 마커를 표시합니다
    reg_marker.setMap(map);
  
    
  
  
    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
  
      // 클릭한 위도, 경도 정보를 가져옵니다 
      var latlng = mouseEvent.latLng;
  
      var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
      message += '경도는 ' + latlng.getLng() + ' 입니다';
  
      // 마커 위치를 클릭한 위치로 옮깁니다
    
      if(reg_marker) {
        reg_marker.setPosition(latlng);
      } else {
        // 지도를 클릭한 위치에 표출할 마커입니다
        reg_marker = new kakao.maps.Marker({ 
          // 지도 중심좌표에 마커를 생성합니다 
          position: map.getCenter() 
        }); 
        // 지도에 마커를 표시합니다
        reg_marker.setMap(map);
      }

      
      $('#lat').val(latlng.getLat());
      $('#lng').val(latlng.getLng());
  
      var resultDiv = document.getElementById('result'); 
      resultDiv.innerHTML = message;
  
    });
  }

  
});

