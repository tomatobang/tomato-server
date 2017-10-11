<!-- app/view/news/list.tpl -->
<html>

<head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" />
</head>

<body>
    <div class="news-view view">
        hi,this is my countdown:
        {% for item in list %}
        <div class="item">
            <a href="{{ item._id }}">{{ item.event }}</a>
            {{ helper.relativeTime(item.endtime) }}
        </div>
        {% endfor %}
    </div>
</body>

</html>