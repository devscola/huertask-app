import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator implements Validator {
    constructor( @Attribute('validateEqual') public validateEqual: string,
        @Attribute('reverse') public reverse: string) {

    }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    private removeValidateEqualError(field) {
        delete field.errors['validateEqual'];
        if (!Object.keys(field.errors).length) field.setErrors(null);
    }

    validate(c: AbstractControl): { [key: string]: any } {
        let selfValue = c.value;

        let controlField = c.root.get(this.validateEqual);

        if (!controlField){ return null }

        if (selfValue !== controlField.value){
            if(this.isReverse) {
                controlField.setErrors({ validateEqual: false })
            }else{
                return { validateEqual: false }
            }
        } else {
            if(this.isReverse) {
                this.removeValidateEqualError(controlField);
            }else{
                return null
            }
        }
    }
}
