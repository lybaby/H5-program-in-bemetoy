<?php
function _get($name, $dval=''){
    return isset($_GET[$name]) ? $_GET[$name] : $dval;
}

function _post($name, $dval=''){
    return isset($_POST[$name]) ? $_POST[$name] : $dval;
}

function _retJson($data='', $code=0, $msg="ok"){
    echo json_encode(['code'=>$code, 'msg'=>$msg, 'data'=>$data]);
}

$site = _post('site');
$type = _post('type');
$id = _post('id');

if($site=='ximalaya'){
    if($type=='album'){
        $url = _post('url');
        $content = file_get_contents($url);
        if(!$content){
            return _retJson('');
        }
        $pattern = "/<a class=\"title\"\s+href=\".*?\/sound\/([\d]+)\".*?title=\"([^\"]+)\"/";
        preg_match_all($pattern, $content, $matches);

        $rlist = [];
        if(count($matches)>2){
            foreach ($matches[1] as $i => $id) {
                $rlist[] = ['name'=>$matches[2][$i], 'id'=>$id, 'site'=>'ximalaya'];
            }
        }

        return _retJson($rlist);
    }else if($type=='detail'){
        $url = 'http://www.ximalaya.com/tracks/'.$id.'.json';
        $content = file_get_contents($url);
        if(!$content){
            return _retJson('');
        }
        $jdata = @json_decode($content, true);
        if($jdata){
            $jdata['download'] = $jdata['play_path'];
        }
        return _retJson($jdata);
    }
}
