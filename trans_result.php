<?php
        $result = "";	
	$Content = $_POST['input1'];
	$ereg='/\n/';
        $arr_str = preg_split($ereg,$Content);
	foreach($arr_str as $value){
		$result = ` echo $value | nc arya-Lenovo-G460 1986`;
		echo $result.'<br>';
	}       
?>
