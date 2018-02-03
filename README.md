# dzo-lib
*이 프로젝트는 예전에 작업했던 사내 자바스크립트 라이브러리입니다.  
시연을 위한 최소한의 코드를 포함하고 있으며, 라이브러리리 소개와 작업한 내용을 설명하기 위한 페이지 입니다.*

이 라이브러리의 구조는 [jQuery](http://jquery.com)를 많이 참고하였으며, 문법도 동일하게 엘리먼트를 선택하고 함수를 호출하는 방식으로 동작한다.

jQuery에서는 엘리먼트 선택자로 [Sizzle](https://sizzlejs.com/)을 사용하는데 이 라이브러리에서는 ID와 엘리먼트 2가지로만 선택할 수 있다. dzo함수에 선택자를 넘겨주면 dzo객체의 기능을 사용할 수 있는 인스턴스가 생성된다.

```
var wrap = dzo('wrap'); //ID
var wrap2 = dzo(document.getElementById('wrap')); //Element
```

이 라이브러리는 스크립트 **유틸리티**, **기사 템플릿**, **UI 컴포넌트**로 구성된다.

- - -

### 유틸리티
기본적으로 유틸리티 성격을 가진 변수, 함수들을 dzo객체에 선언하고 있다.  
dzo객체의 프로토타입에 기술한 것은 인스턴스에 포함되게 되고, 생성자에 직접 기술한 것들은 인스턴스에는 포함되지 않아 유틸리티 역할을 하게 된다. 쿠키, 폰트, 파라미터, 유입에 따른 엘리먼스 디스플레이 처리등이 정의되어있다.

- - - -

### 기사 템플릿
**[DEMO PAGE](http://goo.gl/u4yFLB)** (*&ast; CORS문제로 자체 서버를 경유하여 XML이 로딩되어 속도가 느림.*)

순수 HTML을 사용하여 기사 페이지를 만들수 있는 데이트 어트리뷰트(data-*) 기반의 템플릿 라이브러리.  
dzo.article 함수에 기사 ID를 파라미터로 넣어 Panel( 하나의 데이터와 결합될 템플릿 영역)을 생성하고, render함수에 생성된 Panel을 파라미터로 넣어 템플릿을 랜더링한다.

```
<div id="wrap">
    <div data-dzo="title"></div>
</div>
<script>
    var article = dzo.article({id: '2017112401697'});
    dzo('article-panel').render(article);
</script>
```

Panel과 Model, Action 이 3가지 스크립트가 하나의 Panel로 이루어진다. Panel에서는 불러올 XML URL을 명시하거나, XML이 불러와졌을 경우의 이벤트 함수를 등록할 수 있다. Model에서는 XML데이터를 어떠한 형태로 가공할지를 기술하고, Action에서는 가공한 데이터를 엘리먼트에 어떻게 적용할지를 기술하면 data-dzo 속성으로 기술된 것에 따라 panel.core에서 Model과 Action이 결합된 형태로 엘리먼트를 복사, 수정하게 된다.

어트리뷰트는 일반 어트리뷰트와 반복자 어트리뷰트로 나누어진다. 반복자 어트리뷰트는 기사 XML의 필드 수 만큼 반복자로 지정된 엘리먼트가 복제되고 일반 어트리뷰트는 스크립트에서 지정된 액션을 수행한다.

```
...
//반복자로 지정된 paragraph하위 엘리먼트가 XML 필드 수만큼 복제된다.
<div data-dzo="paragraph">
    <div class="par" data-dzo="paragraph_text"></div>
</div>
...
```

##### 어트리뷰트
|반복자 어트리뷰트|일반 어트리뷰트|
|------------|-----------|
||title|
||subtitle|
||category_name|
||category_link|
||category_link|
||subcategory_link|
||date|
|paragraph||
||paragraph_text|
||paragraph_image|
||paragraph_imageComment|
||paragraph_media|
||paragraph_mediaComment|
|author||
||author_name|
||author_email|
||author_link|
|keyword||
||keyword_header|
||keyword_link|

- - -

### UI 컴포넌트
