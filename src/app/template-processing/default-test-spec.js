export const defaultTestSpec = {
    subject: 'Your-subject-under-test',
    context: 'Your-context',
    scenario: 'Your-scenario',
    given: [{
        type: "object",
        title: "Given-title-1",
        properties: {
            Given1_property_1: {
                type: "string",
                description: "Given1-property-1",
                example: "Given1-property-1-value"
            },
            newAddress: {
                type: "string",
                description: "new address",
                example: "Oak street"
            },
            NewPhone_number: {
                type: "string",
                description: "New phonenumber",
                example: "+44555112100"
            }
        }
    }],
    when: {
        type: "object",
        title: "Customer registered",
        properties: {
            customer_id: {
                type: "string",
                description: "customer_id",
                example: "customerId"
            },
            newAddress: {
                type: "string",
                description: "new address",
                example: "Oak street"
            },
            NewPhone_number: {
                type: "string",
                description: "New phonenumber",
                example: "+44555112100"
            }
        }
    },
    then: [{
        type: "object",
        title: "Customer registered",
        properties: {
            customer_id: {
                type: "string",
                description: "customer_id",
                example: "customerId"
            },
            newAddress: {
                type: "string",
                description: "new address",
                example: "Oak street"
            },
            NewPhone_number: {
                type: "string",
                description: "New phonenumber",
                example: "+44555112100"
            }
        }
    }],
}