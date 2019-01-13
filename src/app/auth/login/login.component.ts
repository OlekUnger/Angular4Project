import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Meta, Title} from "@angular/platform-browser";
import {UsersService} from "../../shared/services/users.service";
import {User} from "../../shared/models/user.model";
import {Message} from "../../shared/models/message.model";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {fadeStateTrigger} from "../../shared/animations/fade.animation";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass'],
    animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    message: Message;

    constructor(private usersService: UsersService,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private title: Title,
                private meta: Meta
    ) {
        title.setTitle('Вход в систему');
        meta.addTags([
            {name: 'keywords', content:'логин,вход'},
            {name: 'description', content:'страница для входа в систему'},

        ])
    }

    ngOnInit() {
        this.message = new Message('danger', '');
        this.route.queryParams.subscribe(
            (params: Params) => {
                if(params['nowCanLogin']) {
                    this.showMessage({text:'Теперь вы можете зайти в систему', type:'success'})
                } else if (params['accessDenied']){
                    this.showMessage({text:'Вам нужно войти в систему', type:'warning'})
                }
            }
        );

        this.form = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
        })
    }

    onSubmit() {
        const formData = this.form.value;

        this.usersService.getUserByEmail(formData.email).subscribe(
            (user: User)=>{
                if(user) {
                    if(user.password === formData.password) {
                        this.message.text = '';
                        // window.localStorage.setItem('user', JSON.stringify(user));
                        this.authService.login(user)
                        this.router.navigate(['/system', 'bill'])
                    } else {
                        this.showMessage({text:'Пароль не верный', type: 'danger'})
                    }
                } else {
                    this.showMessage({text:'Пользователя не существует', type: 'danger'})
                }
            }
        )
        // console.log(this.form)
    }

    private showMessage(message: Message) {
        this.message = message;
        window.setTimeout(()=>{ this.message.text = ''}, 2000)
    }

}
