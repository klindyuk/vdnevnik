<?php
    if (isset($_REQUEST['action'])) {
        if ($_REQUEST['action'] == 'checkin') {
            include 'connection.php';
            $sql = "SELECT * FROM users WHERE school_title='".$_REQUEST['schoolTitle']."' AND report_grade='".$_REQUEST['reportGrade']."'";
            $res = mysqli_query($connect,$sql) or die('Error');
            if (mysqli_num_rows($res) > 0) {
                $data = mysqli_fetch_assoc($res);
                $id = $data['user_id'];
                $visits = $data['visits'] + 1;
                $sql = "UPDATE users SET visits=".$visits." WHERE user_id=".$id;
                mysqli_query($connect,$sql);
                echo $visits;
            } else {
                $sql = "INSERT INTO users(school_title, report_grade, visits) VALUES ('".$_REQUEST['schoolTitle']."','".$_REQUEST['reportGrade']."', 1)";
                $res = mysqli_query($connect,$sql);
                echo 'Создан новый пользователь: '.$_REQUEST['reportGrade'];
            }
            mysqli_close($connect);
        }
    }
?>