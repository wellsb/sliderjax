<?php

if ($_POST['action'] == 'notify') {
    $file = "log.txt";
    file_put_contents($file, "\n".$_POST['fl1'].",".$_POST['fl2'].",".$_POST['fr1'].",".$_POST['fr2'].",".$_POST['bl1'].",".$_POST['bl2'].",".$_POST['br1'].",".$_POST['br2'],  FILE_APPEND);
} else if ($_POST['action'] == 'save') {
    file_put_contents($_POST['file'], $_POST['fl1'].",".$_POST['fl2'].",".$_POST['fr1'].",".$_POST['fr2'].",".$_POST['bl1'].",".$_POST['bl2'].",".$_POST['br1'].",".$_POST['br2']."\n",  FILE_APPEND);
} else if ($_POST['action'] == 'get') {
    $lines = file($_POST['file']);
    echo json_encode($lines);
} else if ($_POST['action'] == 'emptyfile') {
    $f = @fopen($_POST['file'], "r+");
    if ($f !== false) {
        ftruncate($f, 0);
        fclose($f);
    }
} else if ($_POST['action'] == 'list') {
    $filelist = array();
    if ($handle = opendir('.')) {
        while (false !== ($file = readdir($handle))) {
            if ($file != "." && $file != ".." && strtolower(substr($file, strrpos($file, '.') + 1)) == 'rec') {
                array_push($filelist, $file);
            }
        }
        echo json_encode($filelist);
        closedir($handle);
    }
} else if (!$_POST) {
    echo "No Post";
}
?>
